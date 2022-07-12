import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { map } from 'rxjs/operators';
import { ShopsStore, ShopsState } from './shops.store';

@Injectable({ providedIn: 'root' })
export class ShopsQuery extends QueryEntity<ShopsState> {
  // getShops = this.getAll();
  // selectShops$ = this.selectAll();
  // select$ = this.select();

  constructor(protected store: ShopsStore) {
    super(store);
  }

}
