import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ShopPaginateStore, ShopPaginateState } from './shop-paginate.store';

@Injectable({ providedIn: 'root' })
export class ShopPaginateQuery extends QueryEntity<ShopPaginateState> {

  constructor(protected store: ShopPaginateStore) {
    super(store);
  }

}
