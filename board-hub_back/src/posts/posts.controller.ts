import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Request,
  UseInterceptors,
  Query,
  UploadedFiles,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  async findAll(
    @Query('search') search: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<{ posts: PostEntity[]; total: number }> {
    const [posts, total] = await this.postsService.findAll(
      search,
      page,
      limit,
      sortOrder,
    );
    return { posts, total };
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<PostEntity> {
    return this.postsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExtName = extname(file.originalname);
          callback(null, `file-${uniqueSuffix}${fileExtName}`);
        },
      }),
    }),
  )
  create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req,
  ): Promise<PostEntity> {
    const userId = req.user.id;
    return this.postsService.create(createPostDto, userId, files);
  }

  // 인터셉터 -> 순환참조 문제 해결
  // [Nest] 27437  - 12/13/2023, 10:06:03 PM   ERROR [ExceptionsHandler] Converting circular structure to JSON
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExtName = extname(file.originalname);
          callback(null, `file-${uniqueSuffix}${fileExtName}`);
        },
      }),
    }),
  )
  update(
    @Param('id') id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updatePostDto: UpdatePostDto,
    @Request() req,
  ): Promise<PostEntity> {
    const userId = req.user.id;
    return this.postsService.update(id, updatePostDto, userId, files);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number, @Request() req): Promise<void> {
    const userId = req.user.id;
    await this.postsService.deletePostAndFiles(id, userId);
  }
}
