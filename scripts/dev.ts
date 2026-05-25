import { spawn } from 'node:child_process';
import path from 'node:path';

const children = [
  spawn(process.execPath, ['--import', 'tsx', path.join(process.cwd(), 'server', 'index.ts')], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: process.env.NODE_ENV || 'development',
      API_PORT: process.env.API_PORT || '3001',
      API_HOST: process.env.API_HOST || '127.0.0.1',
    },
  }),
  spawn(
    process.execPath,
    [
      path.join(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js'),
      '--port=3000',
      '--host=127.0.0.1',
      '--strictPort',
    ],
    {
      stdio: 'inherit',
    },
  ),
];

const stopChildren = () => {
  for (const child of children) {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  }
};

process.on('SIGINT', stopChildren);
process.on('SIGTERM', stopChildren);
process.on('exit', stopChildren);

for (const child of children) {
  child.on('exit', (code) => {
    if (code && code !== 0) {
      stopChildren();
      process.exit(code);
    }
  });
}
