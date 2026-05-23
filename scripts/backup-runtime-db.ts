import { copyFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { config } from '../server/env';

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupsDir = path.join(config.runtimeDataDir, 'backups');
const source = config.databaseFile;
const destination = path.join(backupsDir, `betterhub-${timestamp}.sqlite`);

await stat(source);
await mkdir(backupsDir, { recursive: true });
await copyFile(source, destination);

console.log(destination);
