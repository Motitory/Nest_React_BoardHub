import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FilesService } from './files.service';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Get('download/:filename')
  async downloadFile(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const filePath = await this.filesService.downloadFile(filename);
      res.sendFile(filePath);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':fileId')
  async deleteFile(
    // @Param('postId') postId: number,
    @Param('fileId') fileId: number,
    // @Request() req,
  ): Promise<void> {
    // const userId = req.user.id;
    await this.filesService.deleteFile(fileId);
  }
}
