import { CreateFileDto } from './create-file.dto';

export class UploadFileDto extends CreateFileDto {
  path: string;
  fileName: string;
}
