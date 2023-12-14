import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Post } from '../posts/post.entity';
import { User } from '../users/user.entity';
import { Like } from '../likes/like.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @ManyToOne(() => User, (user) => user.comments)
  author: User;

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;

  @OneToMany(() => Like, (like) => like.comment)
  likes: Like[];
  // 추가 필드 (작성자, 생성 및 수정 날짜 등)
}
