export class UpdateUserDto {
  readonly nickname?: string;
  readonly password?: string;
  // 이메일 주소는 일반적으로 수정되지 않음
}
