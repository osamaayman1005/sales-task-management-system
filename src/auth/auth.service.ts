import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import {compare} from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { UserRole } from 'src/users/enums/user.role.enum';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {

    constructor(private usersService: UsersService,    
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService) {}

    async validateUser(email: string, password: string): Promise<User | null> {
      const user = await this.usersService.findByEmail(email);
      if (user && (await compare(password, user.password))) {
        return user;
      }
      return null;
    }
    async login(createUserDto: CreateUserDto){
        const expiresAccessToken = new Date();
        expiresAccessToken.setMilliseconds(
            expiresAccessToken.getTime() + parseInt(this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRATION_MS'))
        );
        const user = await this.usersService.findByEmail(createUserDto.email);
        const JwtPayload: JwtPayload = {
            id: user.id,
            role: UserRole.ADMIN
        };
        const accessToken = this.jwtService.sign(JwtPayload, {
            secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: `${this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRATION_MS')}ms`
        });
        return {accessToken};
    }
}
