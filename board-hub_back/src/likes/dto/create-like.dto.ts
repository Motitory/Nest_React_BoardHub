export class CreateLikeDto {
  readonly userId: number;
  readonly postId?: number;
  readonly commentId?: number;
}
