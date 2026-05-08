import { Injectable } from '@nestjs/common';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';

@Injectable()
export class FsStorageService {
  private readonly storageRoot = process.env.STORAGE_DIR ?? resolve(process.cwd(), '..', 'storage');
  private readonly storageDir = join(this.storageRoot, 'resumes');

  async savePdf(
    _fileName: string,
    buffer: Buffer,
  ): Promise<{ storagePath: string; absolutePath: string }> {
    await mkdir(this.storageDir, { recursive: true });
    const storedFileName = `${randomUUID()}.pdf`;
    const absolutePath = join(this.storageDir, storedFileName);
    await writeFile(absolutePath, buffer);
    return {
      absolutePath,
      storagePath: `storage/resumes/${storedFileName}`,
    };
  }
}
