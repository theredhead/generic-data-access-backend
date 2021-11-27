import { Controller, Get } from '@nestjs/common';
import { LoggerService } from 'src/service/logger.service';

@Controller('api/status')
export class StatusController {
  @Get()
  index(): any {
    return {
      status: 'Running',
    };
  }
  constructor(private logger: LoggerService) {}
}
