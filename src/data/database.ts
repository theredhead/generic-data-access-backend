export type Record = { id?: number; [column: string]: any };
export interface RecordSet {
  info?: any;
  fields?: any[];
  rows: Record[];
}
/**
 * Defines an object that can perform a set of common database operations
 */
export interface Database {
  /**
   * Insert a record into a table
   *
   * @param table
   * @param record the record after insert
   */
  insert(table: string, record: Record): Promise<Record>;

  /**
   * update a record in a table
   *
   * @param table
   * @param record the record after the update
   */
  update(table: string, record: Record): Promise<Record>;

  /**
   * delete a record from a table
   *
   * @param table
   * @param id
   * @return the deleted record
   */
  delete(table: string, id: number): Promise<Record>;

  /**
   * select records from a table
   *
   * @param table
   * @param where
   * @param args
   */
  select(table: string, where: string, args: any[]): Promise<RecordSet>;

  /**
   * select a single record from a table
   *
   * @param table
   * @param where
   * @param args
   */
  selectSingle(table: string, where: string, args: any[]): Promise<Record>;

  /**
   * execute a statement, returning a RecordSet
   *
   * @param staement
   * @param args
   */
  execute(staement: string, args: any[]): Promise<RecordSet>;

  /**
   * Execute a statement, returning a single row data
   *
   * @param staement
   * @param args
   */
  executeSingle<T>(statement: string, args: any[]): Promise<T>;

  /**
   * Execute a statement, returning a single scalar piece of data (first column of first row)
   *
   * @param staement
   * @param args
   */
  executeScalar<T>(staement: string, args: any[]): Promise<T>;

  /**
   * Determine if a table exists
   *
   * @param tableName
   */
  tableExists(tableName): Promise<boolean>;

  /**
   * releases all resources
   */
  release(): void;
}
