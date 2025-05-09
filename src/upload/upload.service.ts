import type { ReturnPromiseWithErr } from '@type/return-with-error.type';

import { access, writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UploadFileDto } from './dto/upload-file.dto';

import { exceptionHandler } from '@helper/exception.helper';

@Injectable()
export class UploadService {
  private readonly uploadPath = join(process.cwd(), 'uploads');

  getPath(path: string, fileName: string): string {
    return join(this.uploadPath, path, fileName);
  }

  async create({
    file,
    path,
    fileName,
  }: UploadFileDto): ReturnPromiseWithErr<string> {
    try {
      const format = file.name.split('.').at(-1);

      if (!format) {
        throw new InternalServerErrorException('Unable to save file');
      }

      const filePlacementPath = join(this.uploadPath, path);
      await this.createFolderIfNotExist(filePlacementPath);

      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const name = `${fileName}.${format}`;

      await writeFile(join(filePlacementPath, name), fileBuffer);
      return [join(path, name), null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async delete(path: string, fileName: string): ReturnPromiseWithErr<unknown> {
    try {
      const fullPath = join(this.uploadPath, path, fileName);
      const isExist = await this.exists(fullPath);
      if (!isExist) throw new NotFoundException('File not found');
      await unlink(fullPath);
      return [{}, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  private async createFolderIfNotExist(path: string) {
    const isFolderExist = await this.exists(path);
    if (!isFolderExist) await mkdir(path, { recursive: true });
  }

  private async exists(path: string) {
    try {
      await access(path);
      return true;
    } catch {
      return false;
    }
  }
}
