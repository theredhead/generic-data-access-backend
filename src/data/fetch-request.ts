import { FetchRequest, Sort } from './fetch-predicate.types';
import {
  FetchCompoundPredicteClause,
  FetchPredicteClause,
  FetchSimplePredicteClause,
} from './fetch-predicate.types';

export class FetchRequestSQLWriter {
  write(request: FetchRequest) {
    const args = [];
    const text = [
      'SELECT *',
      'FROM ' + request.table,
      'WHEER',
      ...request.predicates.map((p) => this.expandPredicate(p, args)),
      this.expandSort(request.sort),
    ].join('\n');

    return { text, args };
  }

  expandPredicate(clause: FetchPredicteClause, args: any[]) {
    if (clause.hasOwnProperty('type')) {
      return this.expandCompoundPredicateClause(
        <FetchCompoundPredicteClause>clause,
        args,
      );
    } else {
      return this.expandSimplePredicateClause(
        <FetchSimplePredicteClause>clause,
        args,
      );
    }
  }
  expandSimplePredicateClause(clause: FetchSimplePredicteClause, args: any[]) {
    args.push(clause.args);
    return clause.text;
  }

  expandCompoundPredicateClause(
    clause: FetchCompoundPredicteClause,
    args: any[],
  ) {
    return [
      '(',
      clause.predicates
        .map((p) => this.expandPredicate(p, args))
        .join(` ${clause.type} `),
      ')',
    ].join('');
  }

  expandSort(sort: Sort) {
    return [
      'ORDER BY ',
      sort.map((clause) => `${clause.column} ${clause.direction}`).join(', '),
    ].join('');
  }
}
