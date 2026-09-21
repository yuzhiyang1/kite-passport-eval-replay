// 测试进程：刻意制造各种外部命令行为，不伪装成真实模型。
let text = '';
for await (const chunk of process.stdin) text += chunk;
const input = JSON.parse(text);
if (Object.hasOwn(input, 'assertions') || Object.hasOwn(input, 'expected_output')) process.exit(9);
switch (process.argv[2]) {
  case 'timeout': setInterval(() => {}, 1000); break;
  case 'exit': process.stderr.write('private-key-do-not-store'); process.exit(7); break;
  case 'flood': process.stdout.write('x'.repeat(100000)); break;
  case 'stderr': process.stderr.write('x'.repeat(100000)); break;
  case 'empty': break;
  default: console.log(`answer ${input.id}: ${input.prompt}; ${input.context.map((c) => c.content).join(' ')}`);
}
