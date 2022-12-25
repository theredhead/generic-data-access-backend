import { FetchRequest } from '../src/data/fetch-predicate.types';
import { FetchRequestSQLWriter } from '../src/data/fetch-request';

describe('FetchRequestSQLWriter', () => {
  it('can write a simple select statement', () => {
    const request: FetchRequest = {
      table: 'test',
      predicates: [],
      sort: [],
      pagination: {
        index: 0,
        size: 0,
      },
    };

    const writer = new FetchRequestSQLWriter();
    const result = writer.write(request);

    expect(result.args.length).toBe(0);
    expect(result.text.replace(/(\n|\s\s)/g, ' ').trim()).toBe(
      'SELECT * FROM test',
    );
  });
});

describe('FetchRequestSQLWriter', () => {
  it('can write a simple select statement with a where clause', () => {
    const request: FetchRequest = {
      table: 'test',
      predicates: [
        {
          text: 'one=?',
          args: [1],
        },
        {
          type: 'OR',
          predicates: [
            {
              text: 'foo=?',
              args: ['foo'],
            },
            {
              text: 'bar=?',
              args: ['bar'],
            },
          ],
        },
      ],
      sort: [
        {
          column: 'foo',
          direction: 'ASC',
        },
        {
          column: 'baz',
          direction: 'DESC',
        },
      ],
      pagination: {
        index: 0,
        size: 100,
      },
    };

    const writer = new FetchRequestSQLWriter();
    const result = writer.write(request);

    expect(result.args.length).toBe(3);
    expect(result.text.replace(/(\n|\s\s)/g, ' ').trim()).toBe(
      'SELECT * FROM test WHERE (one=?) AND ((foo=?) OR (bar=?)) ORDER BY foo ASC, baz DESC LIMIT 0, 100',
    );
  });
});
