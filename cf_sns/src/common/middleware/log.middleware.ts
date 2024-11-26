import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";

@Injectable()
export class LogMiddleware implements NestMiddleware {
    use(req: any, res: any, next: NextFunction) { // next 를 실행 안하면 멈춘다.
        console.log(`[REQ] ${req.url} ${new Date().toLocaleString('kr')}`)
        next();
    }
}