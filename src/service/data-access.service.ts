import { config } from './../../test/db.conf';
import { MySqlDatabase } from './../data/mysql/mysql-database';
import { Record } from 'src/data/database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DataAccessService {
  private db = new MySqlDatabase(config);

  async tableInfo(table: string): Promise<any> {
    const data = await this.db.execute(
      `
      SELECT *
      FROM INFORMATION_SCHEMA.TABLES T
      INNER JOIN INFORMATION_SCHEMA.COLUMNS C ON C.TABLE_SCHEMA = T.TABLE_SCHEMA AND C.TABLE_NAME = C.TABLE_NAME
      WHERE T.TABLE_NAME = ?
    `,
      [table],
    );
    return data.rows;
  }

  async index(
    table: string,
    pageIndex = 0,
    pageSize = 1000,
  ): Promise<Record[]> {
    const data = await this.db.select(
      table,
      `LIMIT ${pageIndex * pageSize}, ${pageSize}`,
    );
    return data.rows;
  }

  async selectSingleById(table: string, id: number): Promise<Record> {
    return await this.db.selectSingle(table, ' WHERE id=?', [id]);
  }

  async insert(table: string, record: Record): Promise<Record> {
    return await this.db.insert(table, record);
  }

  async update(table: string, id: number, record: Record): Promise<Record> {
    return await this.db.update(table, { ...record, id });
  }

  async delete(table: string, id: number): Promise<Record> {
    return await this.db.delete(table, id);
  }

  async getColumnFromRecordbyId(
    table: string,
    id: number,
    column: string,
  ): Promise<string> {
    const record = await this.db.selectSingle(table, ' WHERE id=?', [id]);
    return record[column] ?? null;
  }

  async updateColumnForRecordById(
    table: string,
    id: number,
    column: string,
    value: string,
  ): Promise<Record> {
    const record = { [column]: value };
    return await this.db.update(table, { ...record, id });
  }

  async createTable(table: string, columns: any[]) {
    const lines = [
      `CREATE TABLE ${table} (`,
      ` id int not null auto_increment primary key,`,
    ];

    for (const col of columns) {
      const nullable = col?.nullable ?? false ? 'not nullable' : '';
      lines.push(` ${col.name} ${col.type} ${nullable}`);
    }
    lines.push(') charset=utf8');
    const script = lines.join('\n');

    return script;
    // await this.db.execute(script);
  }
}

export interface ColumnDescription {
  name: string;
  type: string;
  nullable: boolean;
}
