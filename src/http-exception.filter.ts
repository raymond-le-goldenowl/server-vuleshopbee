import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JsonWebTokenError } from 'jsonwebtoken';
import { Request } from 'express';
import {
  QueryFailedError,
  EntityNotFoundError,
  CannotCreateEntityIdMapError,
} from 'typeorm';
import { HttpAdapterHost } from '@nestjs/core';

import { GlobalResponseError } from './global-response-error';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    let message = (exception as Error).message;
    let code = 'HttpException';

    Logger.error(
      message,
      (exception as any).stack,
      `${httpAdapter.getRequestMethod(request)} ${httpAdapter.getRequestUrl(
        request,
      )}`,
    );

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    switch (exception.constructor) {
      case HttpException:
        httpStatus = (exception as HttpException).getStatus();
        break;
      case BadRequestException:
        httpStatus = (exception as BadRequestException).getStatus();
        message =
          (exception as any)?.response?.message ||
          (exception as BadRequestException).message;
        code = (exception as any).code;
        break;
      case JsonWebTokenError:
        httpStatus = (exception as any).getStatus();
        message = (exception as JsonWebTokenError).message;
        code = (exception as any).code;
        break;
      case UnauthorizedException:
        httpStatus = (exception as UnauthorizedException).getStatus();
        message = (exception as UnauthorizedException).message;
        code = (exception as any).code;
        break;
      case NotFoundException:
        httpStatus = (exception as NotFoundException).getStatus();
        message = (exception as NotFoundException).message;
        code = (exception as any).code;
        break;
      case ConflictException:
        httpStatus = (exception as ConflictException).getStatus();
        message = (exception as ConflictException).message;
        code = (exception as any).code;
        break;
      case ForbiddenException:
        httpStatus = (exception as ForbiddenException).getStatus();
        message = (exception as ForbiddenException).message;
        code = (exception as any).code;
        break;
      case QueryFailedError: // this is a TypeOrm error
        httpStatus = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as QueryFailedError).message;
        code = (exception as any).code;
        break;
      case EntityNotFoundError: // this is another TypeOrm error
        httpStatus = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as EntityNotFoundError).message;
        code = (exception as any).code;
        break;
      case CannotCreateEntityIdMapError: // and another
        httpStatus = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as CannotCreateEntityIdMapError).message;
        code = (exception as any).code;
        break;
      default:
        httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    httpAdapter.reply(
      ctx.getResponse(),
      GlobalResponseError(httpStatus, message, code, request),
      httpStatus,
    );
  }
}
