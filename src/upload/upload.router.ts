import Elysia, { t } from 'elysia';
import { UploadService } from './upload.service';
import { HttpException } from '@exception';

export const UploadRouter = new Elysia({ prefix: 'uploads' });
const uploadService = new UploadService();

UploadRouter.get(
  '/logos/:file',
  async ({ params, error }) => {
    const file = await uploadService.get('logos', params.file);
    if (file instanceof HttpException) throw error(file.status, { ...file });
    return file;
  },
  { params: t.Object({ file: t.String() }) },
);
