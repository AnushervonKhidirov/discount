import { NotFoundException } from '@exception';
import type { UploadDto } from './dto/upload.dto';

import { file } from 'elysia';
import { exists, writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { v4 as uuid } from 'uuid';

export class UploadService {
  async get(path: string, fileName: string) {
    const fullPath = join(process.cwd(), 'uploads', path, fileName);
    const isExist = await exists(fullPath);
    if (!isExist) return new NotFoundException('File not found');
    return file(fullPath);
  }

  async create({ file, path, fileName }: UploadDto) {
    const format = file.name.split('.').at(-1);
    if (!format) return;

    const fullPath = join(process.cwd(), path);

    await this.createFolderIfNotExist(fullPath);

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const name = `${fileName}-${uuid()}.${format}`;

    await writeFile(join(fullPath, name), fileBuffer);
    return join(path, name);
  }

  async delete(path: string, fileName: string) {
    const fullPath = join(process.cwd(), 'uploads', path, fileName);
    const isExist = await exists(fullPath);
    if (!isExist) return new NotFoundException('File not found');
    await unlink(fullPath);
  }

  private async createFolderIfNotExist(path: string) {
    const isFolderExist = await exists(path);
    if (!isFolderExist) await mkdir(path, { recursive: true });
  }
}
