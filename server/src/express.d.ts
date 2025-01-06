// server/src/express.d.ts
import { Request } from 'express';

declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            _id: string;
            username: string;
            email: string;
        };
    }
}