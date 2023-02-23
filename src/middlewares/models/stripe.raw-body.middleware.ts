import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response, raw } from 'express';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  public use(request: Request, res: Response, next: NextFunction) {
    raw({ type: 'application/json' })(request, res as any, next);
  }
}
