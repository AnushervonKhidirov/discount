export class UploadFileDto {
  file: Express.Multer.File;
  path: string;
  fileName: string;
}
