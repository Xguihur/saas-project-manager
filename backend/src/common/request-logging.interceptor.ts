import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';
import { REQUEST_ID_HEADER } from './request-id.middleware';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const startedAt = Date.now();
    const requestId = request.header(REQUEST_ID_HEADER) ?? 'unknown';

    return next.handle().pipe(
      tap({
        next: () => this.log(request, response, requestId, startedAt),
        error: () => this.log(request, response, requestId, startedAt),
      }),
    );
  }

  private log(request: Request, response: Response, requestId: string, startedAt: number) {
    this.logger.log(
      JSON.stringify({
        method: request.method,
        path: request.path,
        statusCode: response.statusCode,
        durationMs: Date.now() - startedAt,
        requestId,
      }),
    );
  }
}
