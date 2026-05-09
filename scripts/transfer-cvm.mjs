#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const deployDir = resolve(rootDir, 'dist-deploy');
const remoteDir = 'resume-app';

function fail(message) {
  console.error(message);
  process.exit(1);
}

function run(command, args) {
  const result = spawnSync(command, args, { cwd: rootDir, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function getArg(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : '';
}

const host = getArg('--host');
const user = getArg('--user');
const key = getArg('--key');

if (!host || !user) fail('--host and --user are required.');
if (key && !existsSync(resolve(rootDir, key))) fail(`Missing key: ${key}`);
if (!existsSync(deployDir)) fail('Missing dist-deploy. Run deploy:cvm:pack first.');
if (!existsSync(resolve(deployDir, 'frontend.tar.gz')) && !existsSync(resolve(deployDir, 'frontend.tar'))) fail('Missing dist-deploy/frontend archive.');
if (!existsSync(resolve(deployDir, 'backend.tar.gz')) && !existsSync(resolve(deployDir, 'backend.tar'))) fail('Missing dist-deploy/backend archive.');
if (!existsSync(resolve(deployDir, 'docker-compose.yml'))) fail('Missing dist-deploy/docker-compose.yml');
if (!existsSync(resolve(deployDir, '.env'))) fail('Missing dist-deploy/.env');
if (!existsSync(resolve(deployDir, 'start-remote.sh'))) fail('Missing dist-deploy/start-remote.sh');

const sshArgs = key ? ['-i', resolve(rootDir, key)] : [];
const remote = `${user}@${host}`;

run('ssh', [...sshArgs, remote, `mkdir -p '${remoteDir}'`]);
run('scp', [...sshArgs, '-r', deployDir, `${remote}:./`]);
run('ssh', [...sshArgs, remote, `chmod +x '${remoteDir}/start-remote.sh' && cp '${remoteDir}/start-remote.sh' ./start-remote.sh && chmod +x ./start-remote.sh`]);
