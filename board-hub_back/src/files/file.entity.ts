import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Post } from '../posts/post.entity';
// import { Exclude } from 'class-transformer';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  path: string;

  // @Exclude({ toPlainOnly: true })
  @ManyToOne(() => Post, (post) => post.files)
  post: Post;
}
