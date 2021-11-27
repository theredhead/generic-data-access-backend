import { Logger } from '@nestjs/common';

export class LoggerService {
  logger: Logger = new Logger(this.constructor.name);

  log(message: string) {
    this.logger.log(message);
  }
}
