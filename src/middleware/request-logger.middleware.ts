import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from 'src/service/logger.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(`[${req.ip}] ${req.method} ${req.url}`);
    next();
  }
  constructor(private logger: LoggerService) {}
}
