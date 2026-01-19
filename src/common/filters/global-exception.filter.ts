import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AppConfigService } from '../../configs/config.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    constructor(private readonly config: AppConfigService) { }

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const isHttpException = exception instanceof HttpException;
        const status = isHttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;
        const exceptionResponse = isHttpException ? exception.getResponse() : null;

        const responseBody = {
            success: false,
            statusCode: status,
            message: this.resolveMessage(exceptionResponse, exception),
            error: this.resolveError(exceptionResponse, exception),
            path: request?.url,
            method: request?.method,
            timestamp: new Date().toISOString(),
            traceId: this.getTraceId(request),
        };

        const summaryMessage = `${request?.method} ${request?.url} -> ${status} ${Array.isArray(responseBody.message)
            ? responseBody.message.join(', ')
            : responseBody.message
            }`;

        if (status >= 500) {
            this.logger.error(summaryMessage, (exception as any)?.stack);
        } else {
            this.logger.warn(summaryMessage);
        }

        response.status(status).json(responseBody);
    }

    private resolveMessage(
        exceptionResponse: unknown,
        exception: unknown,
    ): string | string[] {
        if (exceptionResponse && typeof exceptionResponse === 'object') {
            const message = (exceptionResponse as any).message;
            if (message) {
                return message;
            }
        }

        if (exception instanceof HttpException) {
            return exception.message || 'Unexpected error';
        }

        return this.config.IS_PRODUCTION
            ? 'Internal server error'
            : (exception as any)?.message || 'Internal server error';
    }

    private resolveError(exceptionResponse: unknown, exception: unknown): string {
        if (this.config.IS_PRODUCTION && !(exception instanceof HttpException)) {
            return 'Internal server error';
        }

        if (exceptionResponse && typeof exceptionResponse === 'object') {
            const error = (exceptionResponse as any).error;
            if (error) {
                return error;
            }
        }

        if (exception instanceof Error) {
            return exception.name;
        }

        return 'Error';
    }

    private getTraceId(request: Request): string | undefined {
        return request?.traceId;
    }
}
