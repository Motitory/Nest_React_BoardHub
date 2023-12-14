import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async findById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ id });
  }

  async create(
    email: string,
    password: string,
    nickname: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      nickname,
    });
    return this.usersRepository.save(user);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findOneBy({ email });
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.nickname, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      id: user.id,
      nickname: user.nickname,
    };
  }

  async findOne(id: number): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ id });
  }
}
