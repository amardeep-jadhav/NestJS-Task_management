import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmExModule } from 'src/database/typeorm-ex.module';
import { UserRepository } from './users.respository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { TokenBlacklistService } from './token-blacklist.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'topSecret51',
      signOptions: { expiresIn: 3600 },
    }),
    TypeOrmExModule.forCustomRepository([UserRepository]),
  ],
  providers: [AuthService, JwtStrategy, TokenBlacklistService],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
