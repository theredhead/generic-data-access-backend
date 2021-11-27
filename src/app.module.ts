import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerService } from './service/logger.service';
import { DataAccessService } from './service/data-access.service';
import { DataAccessController } from './controllers/data-access.controller';
import { StatusController } from './controllers/status.controller';
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';

@Module({
  imports: [],
  controllers: [DataAccessController, StatusController],
  providers: [LoggerService, DataAccessService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware)
      .forRoutes(DataAccessController, StatusController);
  }
}
