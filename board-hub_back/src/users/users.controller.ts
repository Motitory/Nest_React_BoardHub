import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('api')
export class ApiUserController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUser(@Req() req) {
    // JWT에서 추출한 사용자 ID를 사용
    const user = await this.usersService.findById(req.user.id);
    return user;
  }
}

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    const { email, password, nickname } = createUserDto; // Destructuring
    return this.usersService.create(email, password, nickname);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.usersService.login(req.user); // 로그인 로직 (상세 구현은 UsersService에 달려있음)
  }
}
