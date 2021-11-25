import { DataAccessService } from './service/data-access.service';
import { DataAccessController } from './controllers/data-access.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [DataAccessController],
  providers: [DataAccessService],
})
export class AppModule {}
