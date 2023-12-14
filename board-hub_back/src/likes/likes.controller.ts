import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('likes')
export class LikesController {
  constructor(private likesService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/post/:postId')
  likePost(@Param('postId') postId: number, @Request() req) {
    const userId = req.user.id;
    return this.likesService.addLikeToPost(userId, postId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/post/:postId')
  unlikePost(@Param('postId') postId: number, @Request() req) {
    const userId = req.user.id;
    return this.likesService.removeLikeFromPost(userId, postId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/comment/:commentId')
  likeComment(@Param('commentId') commentId: number, @Request() req) {
    const userId = req.user.id;
    return this.likesService.addLikeToComment(userId, commentId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/comment/:commentId')
  unlikeComment(@Param('commentId') commentId: number, @Request() req) {
    const userId = req.user.id;
    return this.likesService.removeLikeFromComment(userId, commentId);
  }
}
