import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from './users.respository';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { TokenBlacklistService } from './token-blacklist.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userRepository: UserRepository,
    private tokenBlackListService: TokenBlacklistService,
  ) {
    super({
      passReqToCallback: true,
      secretOrKey: 'topSecret51',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<User> {
    const token = req.headers['authorization'].split(' ')[1];
    const { username } = payload;
    const user = await this.userRepository.findOneBy({ username: username });

    console.log('Origonal  req token', token);
    console.log('Balcklisted token', this.tokenBlackListService.blackListed);
    if (!user || this.tokenBlackListService.isTokenBlackListed(token)) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
