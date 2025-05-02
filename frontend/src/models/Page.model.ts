export interface SortInfo {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface PageInfo {
  pageNumber: number;
  pageSize: number;
  sort: SortInfo;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Page<T> {
  content: T[];
  pageable: PageInfo;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number; // current page
  sort: SortInfo;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}
