import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v7 as uuidv7 } from 'uuid';

export const REQUEST_ID_HEADER = 'x-request-id';

declare global {
    namespace Express {
        interface Request {
            traceId: string;
        }
    }
}

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const existingId = req.headers[REQUEST_ID_HEADER];
        const traceId = (Array.isArray(existingId) ? existingId[0] : existingId) || uuidv7();

        req.traceId = traceId;
        res.setHeader(REQUEST_ID_HEADER, traceId);

        next();
    }
}
