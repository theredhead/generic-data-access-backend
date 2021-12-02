import { MySqlDatabase } from '../src/data/mysql/mysql-database';
import { databaseConfiguration } from '../src/db.conf';

describe('MysqlDatabase', () => {
  let database: MySqlDatabase;
  const testTableName = 'MysqlDatabase_test';

  const testRecords: any[] = [
    { foo: 'Lorum ipsum', bar: 'dolar sit', baz: 'amet' },
    { foo: 'Amet', bar: 'sit dolar', baz: 'ipsum lorem' },
  ];

  beforeEach(() => {
    database = new MySqlDatabase(databaseConfiguration);
  });

  it('can create a table and ', async () => {
    await database.execute(`
    DROP TABLE IF EXISTS ${testTableName};
    CREATE TABLE ${testTableName} (
      id int not null auto_increment primary key,
      foo varchar(100),
      bar varchar(100),
      baz varchar(100)
    ) charset=utf8
    `);
  });

  it('can connect to a local database', async () => {
    const result = await database.executeScalar('SELECT CURRENT_TIMESTAMP');
    expect(result).not.toBeNull();

    const hello = await database.executeScalar("SELECT 'Hello, World!'");
    expect(hello).toBe('Hello, World!');

    const one = await database.executeScalar('SELECT 1');
    expect(one).toBe(1);
  });

  it('can perform insert operations against an existing table', async () => {
    for (const test of testRecords) {
      const result = await database.insert(testTableName, test);
      expect(result.id).withContext('inserted id').toBeDefined();
      for (const key of Object.keys(test)) {
        expect(result[key]).withContext('column eq').toEqual(test[key]);
      }
    }
  });

  it('can perform select operations against an existing table', async () => {
    const result = await database.select(testTableName);
    expect(result.rows.length)
      .withContext('inserted eq tests')
      .toBe(testRecords.length);
  });

  it('can perform delete, (re)insert and update operations against an existing table', async () => {
    const deleted = await database.delete(testTableName, 1);
    const remaining = await database.select(testTableName);
    expect(remaining.rows.length)
      .withContext('remaining')
      .toBe(testRecords.length - 1);

    expect(remaining.rows.find((row) => row.id == deleted.id)).toBeUndefined();
    const reinserted = await database.insert(testTableName, deleted);
    reinserted.foo = 'foo';
    reinserted.bar = 'bar';
    reinserted.baz = 'baz';
    const updated = await database.update(testTableName, reinserted);

    expect(updated.id)
      .withContext('id: updated should not match deleted')
      .not.toEqual(deleted.id);
    expect(updated.id)
      .withContext('id: updated should match reinserted')
      .toEqual(reinserted.id);
    expect(updated.foo).toEqual('foo');
    expect(updated.bar).toEqual('bar');
    expect(updated.baz).toEqual('baz');
  });

  it('can select from an existing table', async () => {
    const result = await database.select('test', '', []);
    expect(result.rows.length)
      .withContext('selected # rows from test')
      .toBeGreaterThan(3);
  });

  it('can insert determine if a table exists', async () => {
    const no = await database.tableExists('i-most-certainly-do-not-exist');
    expect(no).toBeFalse();

    const yes = await database.tableExists('test');
    expect(yes).toBeTrue();
  });

  it('can drop a yable', async () => {
    await database.execute(`
      DROP TABLE ${testTableName}
    `);
  });
});
