import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ShopsStore, ShopsState } from './shops.store';

@Injectable({ providedIn: 'root' })
export class ShopsQuery extends QueryEntity<ShopsState> {

  constructor(protected store: ShopsStore) {
    super(store);
  }

}
