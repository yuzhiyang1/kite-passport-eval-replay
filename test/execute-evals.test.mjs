import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { run, validateConfig } from '../scripts/execute-evals.mjs';

const suite = [1, 2].map((id) => ({ id, prompt: `question ${id}`, expected_output: 'private grading answer', assertions: [`answer ${id}`] }));
const config = (mode = 'ok') => ({ command: process.execPath, args: [resolve('test/fixtures/agent-process.mjs'), mode], kind: 'synthetic', producer: 'process fixture', timeoutMs: 5000, maxOutputBytes: 10000, caseIds: [1, 2] });
async function workspace(t) {
  const dir = await mkdtemp(resolve(tmpdir(), 'executor-test-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  return dir;
}
test('executes prompts, captures real process output and chains replay', async (t) => {
  const dir = await workspace(t);
  await writeFile(resolve(dir, 'context.md'), 'explicit context');
  const report = await run(suite, { ...config(), contextFiles: ['context.md'] }, resolve(dir, 'result'), dir);
  assert.equal(report.summary.literalPassed, 2);
  const capture = JSON.parse(await readFile(resolve(dir, 'result/capture.json')));
  assert.match(capture.records[0].response, /explicit context/);
  assert.equal(capture.execution.context[0].sha256.length, 64);
  assert.ok(capture.finishedAt);
  assert.match(await readFile(resolve(dir, 'result/junit.xml'), 'utf8'), /failures="0"/);
  await assert.rejects(run(suite, config(), resolve(dir, 'result'), dir), /EEXIST/);
});
test('subset runs retain unexecuted cases as missing', async (t) => {
  const dir = await workspace(t);
  const report = await run(suite, { ...config(), caseIds: [2] }, resolve(dir, 'result'), dir);
  assert.equal(report.summary.missing, 1);
  assert.equal(report.cases[0].status, 'missing');
});
for (const [mode, expected] of [['timeout', 'timeout'], ['exit', 'exit_7'], ['flood', 'output_limit'], ['stderr', 'output_limit'], ['empty', 'empty_response']]) {
  test(`records ${mode} and continues to checkpoint following cases`, async (t) => {
    const dir = await workspace(t);
    const settings = { ...config(mode), timeoutMs: mode === 'timeout' ? 200 : 5000 };
    const report = await run(suite, settings, resolve(dir, 'result'), dir);
    assert.equal(report.summary.errors, 2);
    const raw = await readFile(resolve(dir, 'result/capture.json'), 'utf8');
    assert.ok(!raw.includes('private-key-do-not-store'));
    assert.deepEqual(JSON.parse(raw).records.map((r) => r.error), [expected, expected]);
  });
}
test('spawn failure is captured without hanging', async (t) => {
  const dir = await workspace(t);
  const report = await run(suite, { ...config(), command: resolve(dir, 'not-executable') }, resolve(dir, 'result'), dir);
  assert.equal(report.summary.errors, 2);
});
test('rejects accidental unbounded or ambiguous execution config', () => {
  for (const patch of [{caseIds: []}, {caseIds: [1, 1]}, {caseIds: [999]}, {timeoutMs: 0}, {maxOutputBytes: -1}, {args: 'shell command'}, {kind: 'unknown'}, {contextFiles: [null]}]) {
    assert.throws(() => validateConfig({ ...config(), ...patch }, suite));
  }
});

test('CLI writes replay results and rejects malformed invocation', async (t) => {
  const dir = await workspace(t);
  const cli = resolve('scripts/execute-evals.mjs');
  await writeFile(resolve(dir, 'suite.json'), JSON.stringify(suite));
  await writeFile(resolve(dir, 'config.json'), JSON.stringify(config()));
  const invoke = (args) => spawnSync(process.execPath, [cli, ...args], { cwd: dir, encoding: 'utf8' });
  assert.equal(invoke(['--config', 'config.json', '--suite', 'suite.json', '--out', 'output']).status, 0);
  assert.equal(invoke(['--help']).status, 0);
  for (const args of [[], ['--config'], ['--other', 'x'], ['--out', 'x'], ['--out', 'x', '--out', 'y']]) {
    assert.equal(invoke(args).status, 2);
  }
});
