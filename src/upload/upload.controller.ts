import { Controller, Get, Param, Res } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadPath } from 'src/common/constant/upload';
import { Response } from 'express';

@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get(`${UploadPath.Logo}/:fileName`)
  async getFile(
    @Param('fileName') fileName: string,
    @Res() response: Response,
  ) {
    const filePath = this.uploadService.getPath(UploadPath.Logo, fileName);
    response.sendFile(filePath);
  }
}
