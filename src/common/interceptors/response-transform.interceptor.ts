import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type SuccessResponse<T> = {
    success: true;
    data: T;
    path?: string;
    method?: string;
    timestamp: string;
    traceId?: string;
};

@Injectable()
export class ResponseTransformInterceptor
    implements NestInterceptor<unknown, SuccessResponse<unknown>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<SuccessResponse<unknown>> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request>();

        return next.handle().pipe(
            map((data) => ({
                success: true,
                data: data ?? null,
                path: request?.url,
                method: request?.method,
                timestamp: new Date().toISOString(),
                traceId: request?.traceId,
            })),
        );
    }
}
