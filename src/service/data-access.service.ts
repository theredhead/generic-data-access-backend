import { Injectable } from '@nestjs/common';
import { Record } from 'src/data/database';
import { databaseConfiguration } from '../db.conf';
import { MySqlDatabase } from './../data/mysql/mysql-database';

@Injectable()
export class DataAccessService {
  private db = new MySqlDatabase(databaseConfiguration);

  async getTableNames(): Promise<any[]> {
    const data = await this.db.execute(
      'SELECT T.TABLE_NAME, T.TABLE_TYPE, T.TABLE_ROWS FROM INFORMATION_SCHEMA.TABLES T WHERE T.TABLE_SCHEMA=DATABASE() ORDER BY T.TABLE_TYPE ASC, T.TABLE_NAME ASC',
    );

    return data.rows;
  }

  async tableInfo(table: string): Promise<any> {
    const data = await this.db.execute(
      `
      SELECT C.*
      FROM INFORMATION_SCHEMA.TABLES T
      INNER JOIN INFORMATION_SCHEMA.COLUMNS C ON C.TABLE_SCHEMA = T.TABLE_SCHEMA AND C.TABLE_NAME = T.TABLE_NAME
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

  async execute(text: string, args: any[]) {
    return this.db.execute(text, args);
  }
}

export interface ColumnDescription {
  name: string;
  type: string;
  nullable: boolean;
}
