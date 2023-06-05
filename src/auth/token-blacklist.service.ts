import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenBlacklistService {
  blackListed: string[] = [];

  addToBlackList(token: string): void {
    this.blackListed.push(token.split(' ')[1]);
    console.log('BlackListed tokens', this.blackListed);
  }

  isTokenBlackListed(token: string): boolean {
    return this.blackListed.includes(token);
  }
}
