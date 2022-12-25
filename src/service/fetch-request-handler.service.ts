import { Injectable } from '@nestjs/common';
import { Record, RecordSet } from '../data/database';
import { FetchRequest } from '../data/fetch-predicate.types';
import { FetchRequestSQLWriter } from '../data/fetch-request';
import { DataAccessService } from './data-access.service';

export interface FetchResponse<T extends Record> extends RecordSet {
  rows: T[];
}

@Injectable()
export class FetchRequestHandlerService {
  private writer = new FetchRequestSQLWriter();

  constructor(private db: DataAccessService) {}

  async handleRequest<T extends Record>(
    request: FetchRequest,
  ): Promise<FetchResponse<T>> {
    const cmd = this.writer.write(request);
    const result = await this.db.execute(cmd.text, cmd.args);
    return <FetchResponse<T>>result;
  }
}
