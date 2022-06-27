export interface ShopPaginate {
  id: number | string;
  docs: [];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: number;
  page: number;
  pagingCounter: number;
  prevPage: number;
  totalDocs: number;
  totalPages: number;
}

export function createShopPaginate(params: Partial<ShopPaginate>) {
  return {

  } as ShopPaginate;
}
