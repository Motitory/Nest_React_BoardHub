export class CreatePostDto {
  readonly title: string;
  readonly content: string;
  readonly files?: Express.Multer.File[]; // 여러 파일을 위한 필드
}
