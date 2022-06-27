import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { ShopPaginate } from './shop-paginate.model';

export interface ShopPaginateState extends EntityState<ShopPaginate> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'shop-paginate' })
export class ShopPaginateStore extends EntityStore<ShopPaginateState> {

  constructor() {
    super();
  }


  setShopsWithPaginate(shops: ShopPaginate[]) {
    this.set(shops);
    this.update(state => ({...state}))
  }
  
}
