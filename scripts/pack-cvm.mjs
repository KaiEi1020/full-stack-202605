#!/usr/bin/env node
import { mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const outputDir = resolve(rootDir, 'dist-deploy');
const frontendImage = 'frontend:latest';
const backendImage = 'backend:latest';
const platform = 'linux/amd64';

function run(command, args, cwd = rootDir) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function archiveName(image) {
  return `${image.split(':')[0]}.tar`;
}

rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

run('docker', ['build', '--platform', platform, '-f', resolve(rootDir, 'frontend/Dockerfile'), '-t', frontendImage, resolve(rootDir, 'frontend')]);
run('docker', ['build', '--platform', platform, '-f', resolve(rootDir, 'backend/Dockerfile'), '-t', backendImage, resolve(rootDir, 'backend')]);
run('docker', ['save', '-o', resolve(outputDir, archiveName(frontendImage)), frontendImage]);
run('docker', ['save', '-o', resolve(outputDir, archiveName(backendImage)), backendImage]);
run('gzip', ['-f', resolve(outputDir, archiveName(frontendImage))]);
run('gzip', ['-f', resolve(outputDir, archiveName(backendImage))]);
run('cp', [resolve(rootDir, 'docker-compose.yml'), resolve(outputDir, 'docker-compose.yml')]);
run('cp', [resolve(rootDir, '.env'), resolve(outputDir, '.env')]);
run('cp', [resolve(rootDir, 'scripts/start-remote.sh'), resolve(outputDir, 'start-remote.sh')]);
run('chmod', ['+x', resolve(outputDir, 'start-remote.sh')]);

process.stdout.write(`Packed deployment artifacts to ${outputDir}\n`);
