export interface FetchRequest {
  table: string;
  predicates: FetchPredicte;
  sort: Sort;
}

export interface FetchSimplePredicteClause {
  text: string;
  args: any[];
}

export interface FetchCompoundPredicteClause {
  type: 'AND' | 'OR';
  predicates: FetchPredicte;
}

export type FetchPredicteClause =
  | FetchSimplePredicteClause
  | FetchCompoundPredicteClause;

export type FetchPredicte = FetchPredicteClause[];

export type Sort = SortClause[];

export interface SortClause {
  column: string;
  direction: 'ASC' | 'DESC';
}
