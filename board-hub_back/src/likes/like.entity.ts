import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Post } from '../posts/post.entity';
import { Comment } from '../comments/comment.entity';

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Post, (post) => post.likes, { nullable: true })
  post: Post;

  @ManyToOne(() => Comment, (comment) => comment.likes, { nullable: true })
  comment: Comment;
}
