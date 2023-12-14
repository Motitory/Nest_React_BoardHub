import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from 'src/users/user.entity';
import { Post } from 'src/posts/post.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  // 해당 게시판의 모든 댓글 조회
  findAll(postId: number): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { post: { id: postId } },
      relations: ['author', 'post'], // 필요한 경우 관련 엔티티를 포함
    });
  }

  // 특정 댓글 조회
  findOne(id: number): Promise<Comment> {
    return this.commentsRepository.findOneBy({ id });
  }

  async create(
    commentData: CreateCommentDto,
    userId: number,
    postId: number,
  ): Promise<Comment> {
    // User 및 Post 엔티티 참조를 생성
    const authorReference = { id: userId } as User;
    const postReference = { id: postId } as Post;

    // 새로운 Comment 엔티티 생성
    const newComment = this.commentsRepository.create({
      content: commentData.content,
      author: authorReference,
      post: postReference,
    });

    // Comment 저장
    return this.commentsRepository.save(newComment);
  }

  async update(
    id: number,
    commentData: UpdateCommentDto,
    userId: number,
  ): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.author.id !== userId)
      throw new NotFoundException(
        'You are not authorized to edit this comment',
      );

    // commentData에서 content 필드를 확인하고 업데이트합니다.
    if (commentData.content) {
      comment.content = commentData.content;
    }

    return this.commentsRepository.save(comment);
  }

  async remove(id: number, userId: number): Promise<void> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (comment.author.id !== userId)
      throw new NotFoundException(
        'You are not authorized to delete this comment',
      );

    await this.commentsRepository.delete(id);
  }

  async searchComments(keyword: string): Promise<Comment[]> {
    return this.commentsRepository
      .createQueryBuilder('comment')
      .where('comment.content LIKE :keyword', { keyword: `%${keyword}%` })
      .leftJoinAndSelect('comment.author', 'author')
      .leftJoinAndSelect('comment.post', 'post')
      .getMany();
  }
}
