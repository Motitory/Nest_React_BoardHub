import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';
import { Post } from '../posts/post.entity';
import { Comment } from '../comments/comment.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async addLikeToPost(userId: number, postId: number): Promise<Like> {
    const existingLike = await this.likesRepository.findOne({
      where: { post: { id: postId }, user: { id: userId } },
    });
    if (existingLike) {
      throw new Error('You have already liked this post');
    }

    const post = await this.postsRepository.findOneBy({ id: postId });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    const like = new Like();
    like.user = { id: userId } as User;
    like.post = post;

    return this.likesRepository.save(like);
  }

  async removeLikeFromPost(userId: number, postId: number): Promise<void> {
    const like = await this.likesRepository.findOne({
      where: { post: { id: postId }, user: { id: userId } },
    });
    if (!like) {
      throw new NotFoundException(`Like not found`);
    }

    await this.likesRepository.remove(like);
  }

  async addLikeToComment(userId: number, commentId: number): Promise<Like> {
    const existingLike = await this.likesRepository.findOne({
      where: { post: { id: commentId }, user: { id: userId } },
    });
    if (existingLike) {
      throw new Error('You have already liked this post');
    }

    const comment = await this.commentsRepository.findOneBy({ id: commentId });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    const like = new Like();
    like.user = { id: userId } as User;
    like.comment = comment;

    return this.likesRepository.save(like);
  }

  async removeLikeFromComment(
    userId: number,
    commentId: number,
  ): Promise<void> {
    const like = await this.likesRepository.findOne({
      where: { comment: { id: commentId }, user: { id: userId } },
    });
    if (!like) {
      throw new NotFoundException('Like not found or not yours to remove');
    }

    await this.likesRepository.remove(like);
  }
}
