import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { randomUUID } from 'node:crypto';
import { DomainError, STATUS_BY_CODE } from '../errors/domain-error';
import type { RequestWithId } from '../middleware/request-id.middleware';

export interface ErrorBody {
  statusCode: number;
  message: string[];
  path: string;
  timestamp: string;
  requestId: string;
}

interface Translated {
  statusCode: number;
  message: string[];
}

const GENERIC_500 = 'Something went wrong on our side. Please try again later.';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<RequestWithId>();
    const res = ctx.getResponse<Response>();

    const { statusCode, message } = this.translate(exception);
    const requestId = req.requestId ?? randomUUID();

    // The stack goes to the LOG, never to the client.
    if (statusCode >= 500) {
      const stack = exception instanceof Error ? exception.stack : String(exception);
      this.logger.error(`[${requestId}] ${req.method} ${req.url}`, stack);
    }

    const body: ErrorBody = {
      statusCode,
      message,
      path: req.originalUrl ?? req.url,
      timestamp: new Date().toISOString(),
      requestId,
    };
    res.status(statusCode).json(body);
  }

  // The translate mapping: any thrown thing -> status + messages
  private translate(exception: unknown): Translated {
    if (exception instanceof DomainError) {
      return { statusCode: STATUS_BY_CODE[exception.code], message: [exception.message] };
    }

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const response = exception.getResponse();
      return { statusCode, message: this.extractMessages(response, exception.message) };
    }

    // TypeError, RangeError, anything unknown: generic 500, no details
    return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: [GENERIC_500] };
  }

  private extractMessages(response: string | object, fallback: string): string[] {
    if (typeof response === 'string') return [response];
    const raw = (response as { message?: unknown }).message;
    if (Array.isArray(raw)) return raw.map((m) => String(m));
    if (typeof raw === 'string') return [raw];
    return [fallback];
    }
}