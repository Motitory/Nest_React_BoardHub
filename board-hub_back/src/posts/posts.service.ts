import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from 'src/posts/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from 'src/users/user.entity';
import { File as FileEntity } from 'src/files/file.entity';
import { FilesService } from 'src/files/files.service';
import * as fs from 'fs';
import * as path from 'path';
import { Comment as CommentEntity } from 'src/comments/comment.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(FileEntity)
    private filesRepository: Repository<FileEntity>,
    @Inject(forwardRef(() => FilesService))
    private readonly filesService: FilesService,
    @InjectRepository(CommentEntity)
    private commentsRepository: Repository<CommentEntity>,
  ) {}

  async findAll(
    query: string,
    page: number,
    limit: number,
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<[Post[], number]> {
    const [result, total] = await this.postsRepository
      .createQueryBuilder('post')
      .where(
        query ? 'post.title LIKE :query OR post.content LIKE :query' : '1=1',
        { query: `%${query}%` },
      )
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('post.createdAt', sortOrder) // sortOrder에 따라 정렬 방향 설정
      .leftJoinAndSelect('post.author', 'author')
      .getManyAndCount();

    return [result, total];
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author', 'files'],
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async create(
    postData: CreatePostDto,
    userId: number,
    newFiles: Express.Multer.File[],
  ): Promise<Post> {
    const author = await this.usersRepository.findOneBy({ id: userId });
    if (!author) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const newPost = this.postsRepository.create({
      ...postData,
      author: author,
    });
    await this.postsRepository.save(newPost);

    if (newFiles && newFiles.length) {
      for (const file of newFiles) {
        console.log('file', file);
        await this.filesService.createFileEntity(file, newPost);
      }
    }

    return this.postsRepository.save(newPost);
  }

  async update(
    id: number,
    postData: UpdatePostDto,
    userId: number,
    newFiles: Express.Multer.File[],
  ): Promise<Post> {
    const post = await this.findOne(id);

    if (post.author.id !== userId) {
      throw new NotFoundException('You are not authorized to edit this post');
    }

    // 새 파일 정보 추가
    if (newFiles && newFiles.length) {
      const fileEntitiesPromises = newFiles.map((file) =>
        this.filesService.createFileEntity(file, post),
      );
      const newFileEntities = await Promise.all(fileEntitiesPromises);

      // 타입이 보장된 File 엔티티만 post.files에 추가
      const savedFileEntities = await Promise.all(
        newFileEntities.map((fileEntity) =>
          this.filesRepository.save(fileEntity as FileEntity),
        ),
      );

      post.files = [...post.files, ...savedFileEntities];
    }

    // 게시물 정보 업데이트
    this.postsRepository.merge(post, postData);
    return this.postsRepository.save(post);
  }

  async searchPosts(searchTerm: string): Promise<Post[]> {
    return this.postsRepository
      .createQueryBuilder('post')
      .where('post.title LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('post.content LIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      })
      .leftJoinAndSelect('post.author', 'author')
      .getMany();
  }

  // private createFileEntity(file: Express.Multer.File, post: Post): FileEntity {
  //   const fileEntity = new FileEntity();
  //   fileEntity.filename = file.filename;
  //   fileEntity.path = file.path;
  //   fileEntity.post = post; // Post 엔티티 연결
  //   return fileEntity;
  // }

  async deletePostAndFiles(postId: number, userId: number): Promise<void> {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
      relations: ['author', 'files', 'comments'],
    });

    if (!post || post.author.id !== userId) {
      throw new NotFoundException('Post not found or you are not authorized');
    }

    // 파일 시스템에서 파일들을 삭제
    if (post.files && post.files.length) {
      const deletePromises = post.files.map(async (file) => {
        try {
          // 파일 시스템에서 파일 삭제
          const filePath = path.join(__dirname, '../../uploads', file.filename);
          await fs.promises.unlink(filePath);
        } catch (err) {
          console.error(
            `Failed to delete file from filesystem: ${file.filename}`,
            err,
          );
        }

        // 데이터베이스에서 파일 엔티티 삭제
        await this.filesRepository.remove(file);
      });

      await Promise.all(deletePromises);
    }

    // 관련된 댓글 삭제
    if (post.comments && post.comments.length) {
      await Promise.all(
        post.comments.map(async (comment) => {
          await this.commentsRepository.remove(comment);
        }),
      );
    }

    // 게시글 삭제
    await this.postsRepository.remove(post);
  }
}
