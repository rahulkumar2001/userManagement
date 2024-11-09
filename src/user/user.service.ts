// src/users/users.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class  UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(mobile: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { mobile } });
  }

  async create(mobile: string, name: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userdetails = await this.findOne(mobile);
    if(userdetails){
      throw new BadRequestException('this mobile number already exists.');
    }

    const user = this.usersRepository.create({ mobile, name, password: hashedPassword });
    return this.usersRepository.save(user);
  }



  async validateUser(mobile: string, password: string): Promise<User | null> {
    const user = await this.findOne(mobile);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }
}
