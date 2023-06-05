import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UserRepository } from './users.respository';
import { AuthCredentialsDto } from './dto/auth.credentails.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { TokenBlacklistService } from './token-blacklist.service';

@Injectable()
export class AuthService {
  tokenBlacklist: Set<string> = new Set();
  constructor(
    private tokenBlackListService: TokenBlacklistService,
    private userRespository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authcredentailDto: AuthCredentialsDto): Promise<void> {
    return this.userRespository.creatUser(authcredentailDto);
  }

  async signIn(
    authcredentailDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authcredentailDto;
    const user = await this.userRespository.findOneBy({ username: username });

    if (user && (await bcrypt.compare(password, (await user).password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login crednetails');
    }
  }

  async logout(req: Request): Promise<string> {
    const token = req.headers.authorization;
    if (!token) {
      throw new UnauthorizedException(
        'You are not authorized to perfor this action...',
      );
    }
    this.tokenBlackListService.addToBlackList(token);
    return 'You have been logged out successfully...';
  }
}
