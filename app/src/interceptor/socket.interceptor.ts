import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

class SocketValidationInterceptor implements NestInterceptor {
  private readonly keys: string[];

  constructor(...keys: string[]) {
    this.keys = keys;
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const body: string | object = context.switchToWs().getData();

    if (!(body instanceof Object)) throw new BadRequestException();

    for (const key of this.keys)
      if (!body.hasOwnProperty(key)) throw new BadRequestException();

    return next.handle();
  }
}

export default SocketValidationInterceptor;