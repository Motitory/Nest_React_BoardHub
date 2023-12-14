import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('/posts/:postId/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get()
  findAll(@Param('postId') postId: number): Promise<Comment[]> {
    return this.commentsService.findAll(postId);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Comment> {
    return this.commentsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Param('postId') postId: number,
    @Body() commentData: CreateCommentDto,
    @Request() req,
  ): Promise<Comment> {
    // JWT에서 추출한 사용자 ID를 사용
    const userId = req.user.id; // 주의: 'userId' 대신 'id'를 사용하세요

    // CommentsService의 create 메소드에 postId와 userId를 전달
    return this.commentsService.create(commentData, userId, postId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() commentData: UpdateCommentDto,
    @Request() req,
  ): Promise<Comment> {
    const userId = req.user.id; // 'id' 속성을 사용
    return this.commentsService.update(id, commentData, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number, @Request() req): Promise<void> {
    const userId = req.user.id; // 'id' 속성을 사용
    return this.commentsService.remove(id, userId);
  }
}
