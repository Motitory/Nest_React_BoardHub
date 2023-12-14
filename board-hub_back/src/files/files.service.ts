// files.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File as FileEntity } from 'src/files/file.entity';
import * as fs from 'fs';
import * as path from 'path';
import { Post } from 'src/posts/post.entity';

@Injectable()
export class FilesService {
  private uploadDirectory = path.join(__dirname, '../../uploads');

  constructor(
    @InjectRepository(FileEntity)
    private filesRepository: Repository<FileEntity>,
  ) {}

  // 파일 다운로드
  async downloadFile(filename: string): Promise<string> {
    const filePath = path.join(this.uploadDirectory, filename);

    // 파일 존재 여부 확인
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    return filePath;
  }

  async createFileEntity(
    file: Express.Multer.File,
    post: Post,
  ): Promise<FileEntity> {
    const fileEntity = new FileEntity();
    fileEntity.filename = file.filename;
    fileEntity.path = file.path;
    fileEntity.post = post; // Post 엔티티 연결
    return this.filesRepository.save(fileEntity);
  }

  async replaceFiles(
    post: Post,
    newFiles: Express.Multer.File[],
  ): Promise<void> {
    // 기존 파일 정보 확인 및 제거
    if (post.files && post.files.length) {
      await Promise.all(post.files.map((file) => this.deleteFile(file.id)));
    }

    // 새 파일 정보 추가
    for (const file of newFiles) {
      await this.createFileEntity(file, post);
    }
  }

  async deleteFile(fileId: number): Promise<void> {
    const file = await this.filesRepository.findOne({ where: { id: fileId } });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    // 파일 시스템에서 파일 삭제
    const filePath = path.join(__dirname, '../../uploads', file.filename);
    await fs.promises.unlink(filePath).catch((err) => {
      console.error(`Failed to delete file from filesystem: ${filePath}`, err);
    });

    await this.filesRepository.remove(file);
  }
}
