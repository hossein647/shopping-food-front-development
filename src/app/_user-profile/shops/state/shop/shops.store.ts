import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Shop } from './shop.model';

export interface ShopsState extends EntityState<Shop> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'shops' })
export class ShopsStore extends EntityStore<ShopsState> {

  constructor() {
    super();
  }

  setShops(shops: Shop[]) {
    this.set(shops);
    this.update(state => ({...state}))
  }

}
