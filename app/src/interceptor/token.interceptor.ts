import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Response } from 'express';

import { AuthService } from '@service/auth.service';
import { AuthResponseDto, TokenDto } from '@dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { User } from '@src/entity/user.entity';

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    return next.handle().pipe(
      map(async (result: AuthResponseDto) => {
        const res: Response = context.switchToHttp().getResponse();
        const user: User = context.switchToHttp().getRequest().user;

        // if (result.firstAccess) {
        //   token.sign = this.authService.generateSignCode(userId);
        // } else if (result.twoFactor) {
        //   token.code = await this.authService.generateMailCode(userId);
        // } else if (result.token) {
        //   const { accessToken, refreshToken } =
        //     await this.authService.generateToken(userId);
        //   token.accessToken = accessToken;
        //   token.refreshToken = refreshToken;
        //   await this.redisService.set(userId.toString(), token.refreshToken);
        // }

        const tokenResult = await this.authService.getJwtToken(
          user.name,
          user.id,
        );
        res.cookie('token', tokenResult.access_token, {
          httpOnly: true,
          maxAge: 432000000000,
          domain: '43.200.11.197',
        });
        res.header('token', tokenResult.access_token);

        if (result.status === 302) {
          res.redirect(this.configService.get('serverConfig.clientUrl'));
        } else {
          return { status: result.status };
        }
      }),
    );
  }
}
