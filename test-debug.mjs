import { spawn } from 'child_process';

const child = spawn('npx', ['vitest', 'run', 'src/components/task/__tests__/TaskForm.spec.ts', '--reporter=verbose'], {
  stdio: 'inherit',
  cwd: '/home/tapia/Workspace/freelancer/rocket-bot/rocketbot-challenge-fe'
});

child.on('exit', (code) => {
  console.log(`Test process exited with code ${code}`);
});
