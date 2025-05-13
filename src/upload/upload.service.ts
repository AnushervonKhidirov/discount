import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import type { ReturnPromiseWithErr } from '@type/return-with-error.type';

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { diskStorage } from 'multer';
import { fileTypeFromFile, FileTypeResult } from 'file-type';
import { access, unlink } from 'fs/promises';
import { join, extname } from 'path';
import { v4 as uuid } from 'uuid';

import { exceptionHandler } from '@helper/exception.helper';

const validMimeTypes = ['image/png', 'image/jpg', 'image.jpeg'];
const uploadPath = join(process.cwd(), 'uploads');

@Injectable()
export class UploadService {
  static setFileOptions(directory: string): MulterOptions {
    return {
      storage: diskStorage({
        destination: join(uploadPath, directory),
        filename(_, file, callback) {
          const fileExtension = extname(file.originalname);
          const fileName = uuid() + fileExtension;
          callback(null, fileName);
        },
      }),
      fileFilter(_, file, callback) {
        if (!validMimeTypes.includes(file.mimetype)) {
          callback(
            new BadRequestException('File must be a png, jpg/jpeg'),
            false,
          );
        }

        callback(null, true);
      },
      limits: { files: 1, fileSize: undefined },
    };
  }

  async checkFileContent({
    path,
    fileName,
  }: {
    path: string;
    fileName: string;
  }): ReturnPromiseWithErr<FileTypeResult> {
    const filePath = join(uploadPath, path, fileName);
    const result = await fileTypeFromFile(filePath);

    if (!result) {
      await unlink(filePath);

      return [
        null,
        new BadRequestException("File content doesn't match extension!"),
      ];
    }

    return [result, null];
  }

  async getPath(path: string, fileName: string): ReturnPromiseWithErr<string> {
    try {
      const filePath = join(uploadPath, path, fileName);
      const isExist = await this.exists(filePath);

      if (!isExist) throw new NotFoundException();

      return [filePath, null];
    } catch (err) {
      return exceptionHandler(err);
    }
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
