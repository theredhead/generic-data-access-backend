import * as mysql2 from 'mysql2';
import { Database, Record, RecordSet } from './../database';

/** @format */

export class MySqlDatabase implements Database {
  private readonly pool: mysql2.Pool;

  constructor(private config: any) {
    this.pool = mysql2.createPool({
      ...this.config,
      multipleStatements: true,
    });
  }

  private isResultSetHeader(obj: any): boolean {
    if (obj == null) return false;

    const fields = [
      'fieldCount',
      'affectedRows',
      'insertId',
      'info',
      'serverStatus',
      'warningStatus',
    ];
    let matches = 0;
    fields.map((field) => {
      if ((<any>obj).hasOwnProperty(field)) {
        matches++;
      }
    });
    return matches > 2;
  }

  quoteObjectName = (name: string): string => ['`', name, '`'].join('');

  async insert(table: string, record: Record): Promise<Record> {
    const quotedTableName = this.quoteObjectName(table);
    const data: any = { ...record };
    delete data.id;
    const columns = Object.keys(data).map(this.quoteObjectName).join(', ');
    const tokens = Object.keys(data)
      .map(() => '?')
      .join(', ');
    const values = Object.keys(data).map((key) => data[key]);

    const statement = `INSERT INTO ${quotedTableName} (${columns}) VALUES (${tokens});`;
    const result = await this.execute(statement, values);

    // expect(result.info).withContext('info after execute').not.toBeNull();
    // expect(result.info.insertId).toBeGreaterThanOrEqual(1);
    return await this.selectSingle(table, 'WHERE id=?', [result.info.insertId]);
  }

  async update(table: string, record: Record): Promise<Record> {
    const id = record.id;
    const data: any = { ...record };
    delete data.id;
    const quotedTableName = this.quoteObjectName(table);
    const snippets = Object.keys(data)
      .map((col) => [this.quoteObjectName(col), '=?'].join(''))
      .join(', ');
    const statement = `UPDATE ${quotedTableName} SET ${snippets} WHERE id=?`;
    await this.execute(statement, [...Object.values(data), id]);
    return await this.selectSingle(table, 'WHERE id=?', [id]);
  }

  async delete(table: string, id: number): Promise<Record> {
    const quotedTableName = this.quoteObjectName(table);
    const record = await this.selectSingle(table, 'WHERE id=?', [id]);
    await this.execute(`DELETE FROM ${quotedTableName} WHERE id=?`, [id]);
    return record;
  }

  async select(
    table: string,
    additional = '',
    args: any[] = [],
  ): Promise<RecordSet> {
    const quotedTableName = this.quoteObjectName(table);
    const result = await this.execute(
      `SELECT * FROM ${quotedTableName} ${additional}`,
      args,
    );
    return result;
  }

  async selectSingle(
    table: string,
    additional: string,
    args: any[],
  ): Promise<Record> {
    const quotedTableName = this.quoteObjectName(table);
    const result = await this.execute(
      `SELECT * FROM ${quotedTableName} ${additional} LIMIT 1`,
      args,
    );
    return result.rows.shift();
  }

  async execute(statement: string, args: any[] = []): Promise<RecordSet> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((cnErr, cn) => {
        if (cnErr) reject(cnErr);
        cn.query(statement, args, (err, rows, fields) => {
          try {
            if (err) {
              reject(err);
              return;
            }
            const result = {
              info: {},
              rows: [],
              fields: fields.map((field) => ({
                name: field.name,
                flags: field.flags,
                type: field.type ?? (<any>field).columnType,
                length: field.length ?? (<any>field).columnLength,
                default: field.default,
                // f: field,
              })),
            };

            if (this.isResultSetHeader(rows)) {
              result.info = { foo: 'checkpoint', ...rows };
              rows = [];
            } else if (this.isResultSetHeader(<any[]>rows[0])) {
              result.info = (<any[]>rows).shift();
            }
            if ((<any[]>rows)?.length) {
              result.rows = <any>rows;
            }
            resolve(result);
          } catch (throwable) {
            reject(throwable);
          } finally {
            cn.release();
          }
        });
        // this.pool.releaseConnection(cn);
      });
    });
  }

  async executeSingle<T>(statement: string, args: any[] = []): Promise<T> {
    const result = await (await this.execute(statement, args)).rows;
    return <T>(<any[]>result).shift();
  }

  async executeScalar<T>(statement: string, args: any[] = []): Promise<T> {
    const result = await this.executeSingle(statement, args);
    const key = Object.keys(result).shift();
    const scalar = (<any>result)[key]; //[0];
    return <T>(<unknown>scalar);
  }

  async tableExists(tableName): Promise<boolean> {
    const count = await this.executeScalar<number>(
      'SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=?',
      [tableName],
    );
    return count === 1;
  }

  release(): void {
    (<any>this.pool) = null;
  }
}
