export interface FetchRequest {
  table: string;
  predicates: FetchPredicate;
  sort: Sort;
  pagination?: FetchRequestPagination;
}

export interface FetchRequestPagination {
  size: number;
  index: number;
}

export interface FetchSimplePredicteClause {
  text: string;
  args: any[];
}

export interface FetchCompoundPredicteClause {
  type: 'AND' | 'OR';
  predicates: FetchPredicate;
}

export type FetchPredicteClause =
  | FetchSimplePredicteClause
  | FetchCompoundPredicteClause;

export type FetchPredicate = FetchPredicteClause[];

export type Sort = SortClause[];

export interface SortClause {
  column: string;
  direction: 'ASC' | 'DESC';
}
