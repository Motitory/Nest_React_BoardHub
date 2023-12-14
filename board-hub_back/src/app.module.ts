import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { Post } from './posts/post.entity';

import { ApiUserController, UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { User } from './users/user.entity';

import { CommentsController } from './comments/comments.controller';
import { CommentsService } from './comments/comments.service';
import { Comment } from './comments/comment.entity';

import { LikesController } from './likes/likes.controller';
import { LikesService } from './likes/likes.service';
import { Like } from './likes/like.entity';

import { File } from './files/file.entity';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FilesService } from './files/files.service';
import { FilesController } from './files/files.controller';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Post, User, Comment, Like, File]),
    AuthModule, // AuthModule 추가
    UsersModule, // UsersModule 추가
  ],
  controllers: [
    AppController,
    UsersController,
    PostsController,
    FilesController,
    CommentsController,
    LikesController,
    ApiUserController,
  ],
  providers: [
    AppService,
    UsersService,
    PostsService,
    FilesService,
    CommentsService,
    LikesService,
  ],
})
export class AppModule {}
