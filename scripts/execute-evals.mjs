#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { readFile, writeFile, mkdir, mkdtemp, rename, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { validateSuite, suiteDigest, replay, junit, markdown } from './replay-evals.mjs';

/** 配置仅来自操作者；提示词不参与命令拼接，且不经过 shell。 */
export function validateConfig(config, suite) {
  if (!config || typeof config.command !== 'string' || !config.command.trim()
      || !Array.isArray(config.args) || !config.args.every((a) => typeof a === 'string')
      || !['recorded', 'synthetic'].includes(config.kind)
      || typeof config.producer !== 'string' || !config.producer.trim()) throw new Error('Invalid command, args, kind or producer');
  for (const [key, max] of [['timeoutMs', 600000], ['maxOutputBytes', 10485760]]) {
    if (!Number.isSafeInteger(config[key]) || config[key] < 1 || config[key] > max) throw new Error(`Invalid ${key}`);
  }
  if (!Array.isArray(config.caseIds) || !config.caseIds.length
      || new Set(config.caseIds).size !== config.caseIds.length
      || !config.caseIds.every((id) => suite.some((item) => item.id === id))) throw new Error('Explicit unique caseIds required');
  if (config.contextFiles !== undefined && (!Array.isArray(config.contextFiles)
      || !config.contextFiles.every((p) => typeof p === 'string' && p.trim()))) throw new Error('Invalid contextFiles');
  return config;
}

/** 中止整个子进程组，避免超时后后台调用继续消耗资源。 */
function stopTree(child) {
  if (!child.pid) return;
  if (process.platform === 'win32') {
    const killer = spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true });
    killer.on('error', () => child.kill('SIGKILL'));
  } else {
    try { process.kill(-child.pid, 'SIGKILL'); } catch { child.kill('SIGKILL'); }
  }
}

/** 标准输入只包含问题和显式上下文；断言及 expected_output 永远不发给 Agent。 */
export function executeCase(config, item, context, cwd) {
  return new Promise((done) => {
    let output = [], size = 0, failure = null;
    const start = Date.now();
    const child = spawn(config.command, config.args, {
      cwd, shell: false, windowsHide: true, detached: process.platform !== 'win32',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    const fail = (reason) => {
      if (failure) return;
      failure = reason;
      stopTree(child);
    };
    const timer = setTimeout(() => fail('timeout'), config.timeoutMs);
    const collect = (chunk, save) => {
      size += chunk.length;
      if (size > config.maxOutputBytes) fail('output_limit');
      else if (save) output.push(chunk);
    };
    child.stdout.on('data', (chunk) => collect(chunk, true));
    // stderr 同样计入上限，但不写入报告，避免泄露后端凭据或诊断数据。
    child.stderr.on('data', (chunk) => collect(chunk, false));
    child.stdin.on('error', () => fail('stdin_error'));
    child.on('error', () => { failure = 'spawn_error'; });
    child.on('close', (code) => {
      clearTimeout(timer);
      const response = Buffer.concat(output).toString('utf8').trim();
      const error = failure || (code !== 0 ? `exit_${code}` : !response ? 'empty_response' : null);
      done({ id: item.id, ...(error ? { error } : { response }), durationMs: Date.now() - start });
    });
    child.stdin.end(JSON.stringify({ id: item.id, prompt: item.prompt, context }) + '\n');
  });
}

/** 每个完成用例原子保存一次；后续失败不丢失已完成的真实调用记录。 */
export async function run(suite, config, out, configDir) {
  validateSuite(suite);
  validateConfig(config, suite);
  const context = await Promise.all((config.contextFiles || []).map(async (path) => {
    const content = await readFile(resolve(configDir, path), 'utf8');
    return { name: path, content };
  }));
  await mkdir(out); // 不复用旧目录，防止覆盖原始证据。
  const capture = {
    schemaVersion: 1, suiteSha256: suiteDigest(suite), kind: config.kind,
    producer: config.producer, startedAt: new Date().toISOString(),
    execution: {
      nodeVersion: process.version, platform: process.platform,
      command: config.command, requestedCaseIds: config.caseIds,
      timeoutMs: config.timeoutMs, maxOutputBytes: config.maxOutputBytes,
      context: context.map(({ name, content }) => ({ name, sha256: createHash('sha256').update(content).digest('hex') })),
    }, records: [],
  };
  const checkpoint = async () => {
    await writeFile(resolve(out, 'capture.partial.json'), JSON.stringify(capture, null, 2) + '\n');
    await rename(resolve(out, 'capture.partial.json'), resolve(out, 'capture.json'));
  };
  await checkpoint();
  for (const item of suite.filter((item) => config.caseIds.includes(item.id))) {
    const cwd = await mkdtemp(resolve(tmpdir(), 'passport-agent-'));
    try { capture.records.push(await executeCase(config, item, context, cwd)); }
    finally { await rm(cwd, { recursive: true, force: true }); }
    await checkpoint();
  }
  capture.finishedAt = new Date().toISOString();
  await checkpoint();
  const report = replay(suite, capture);
  for (const [name, text] of [['report.json', JSON.stringify(report, null, 2)], ['report.md', markdown(report)], ['junit.xml', junit(report)]]) {
    await writeFile(resolve(out, name), text);
  }
  return report;
}

export async function main(args) {
  const options = {};
  if (args.length === 1 && args[0] === '--help') {
    console.log('Usage: node scripts/execute-evals.mjs --config FILE --out NEW_DIR [--suite FILE]');
    return 0;
  }
  for (let i = 0; i < args.length; i += 2) {
    if (!['--config', '--out', '--suite'].includes(args[i]) || options[args[i]]
        || !args[i + 1] || args[i + 1].startsWith('--')) throw new Error('Invalid options');
    options[args[i]] = resolve(args[i + 1]);
  }
  if (!options['--config'] || !options['--out']) throw new Error('--config and --out required');
  const suitePath = options['--suite'] || fileURLToPath(new URL('../evals/evals.json', import.meta.url));
  const suite = JSON.parse(await readFile(suitePath, 'utf8'));
  const config = JSON.parse(await readFile(options['--config'], 'utf8'));
  const report = await run(suite, config, options['--out'], dirname(options['--config']));
  console.log(JSON.stringify(report.summary));
  return report.summary.literalPassed === report.summary.total ? 0 : 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).then((code) => { process.exitCode = code; }).catch((error) => {
    console.error(`Execution error: ${error.message}`);
    process.exitCode = 2;
  });
}
