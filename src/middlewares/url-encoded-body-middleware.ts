import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response, urlencoded } from 'express';

@Injectable()
export class UrlEncodedBodyMiddleware implements NestMiddleware {
  public use(request: Request, res: Response, next: NextFunction) {
    urlencoded({})(request, res as any, next);
  }
}
