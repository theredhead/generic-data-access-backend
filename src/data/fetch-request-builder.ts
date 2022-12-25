import {
  FetchRequest,
  FetchSimplePredicteClause,
  Sort,
} from './fetch-predicate.types';

export function from(table: string): FetchRequestBuilder {
  return new FetchRequestBuilder(table);
}

interface WhereClause {
  text: string;
  args: any;
}

export class FetchRequestBuilder {
  public readonly request: FetchRequest = {
    table: '',
    predicates: [],
    sort: [],
    pagination: {
      index: 0,
      size: 100,
    },
  };

  constructor(table: string) {
    this.request.table = table;
  }
  //#region where
  where(where: WhereClause[]): FetchRequestBuilder;
  where(text: string, ...args: any[]): FetchRequestBuilder;
  where(...args: any[]): FetchRequestBuilder {
    if (args.length === 1) {
      return this._whereByAddingWhereClauseArray(args[0]);
    }
    return this._whereByAddingFetchSimplePredicteClause(args[0], args.slice(1));
  }

  private _whereByAddingFetchSimplePredicteClause(
    text: string,
    ...args: any[]
  ) {
    this.request.predicates.push({ text, args });
    return this;
  }

  private _whereByAddingWhereClauseArray(where: WhereClause[]) {
    this.request.predicates.push(...where);
    return this;
  }
  //#endregion where
  //#region whereAnd/Or
  whereAnd(predicates: FetchSimplePredicteClause[]) {
    this.request.predicates.push({ type: 'AND', predicates });
    return this;
  }
  whereOr(predicates: FetchSimplePredicteClause[]) {
    this.request.predicates.push({ type: 'OR', predicates });
    return this;
  }
  //#endregion whereAnd/Or
  //#region orderBy
  orderBy(clauses: Sort): FetchRequestBuilder;
  orderBy(column: string, direction: 'ASC' | 'DESC'): FetchRequestBuilder;
  orderBy(...args: any[]): FetchRequestBuilder {
    if (args.length === 1 && Array.isArray(args[0])) {
      return this._orderBySortClausesArray(args[0]);
    }
    return this._orderByColumnAndDirection(args[0], args[1]);
  }
  private _orderBySortClausesArray(clauses: Sort): FetchRequestBuilder {
    this.request.sort = clauses;
    return this;
  }
  private _orderByColumnAndDirection(
    column: string,
    direction: 'ASC' | 'DESC',
  ): FetchRequestBuilder {
    this.request.sort.push({ column, direction });
    return this;
  }
  //#endregion orderBy
  //#region paginate
  paginate(pageSize: number, pageIndex: number = 0): FetchRequestBuilder {
    this.request.pagination.size = pageSize;
    this.request.pagination.index = pageIndex;
    return this;
  }
  //#endregion paginate
}

// const req = from('users').where('login = ?', 'kris')
