import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response, json } from 'express';

@Injectable()
export class JsonBodyMiddleware implements NestMiddleware {
  public use(request: Request, res: Response, next: NextFunction) {
    json()(request, res as any, next);
  }
}
