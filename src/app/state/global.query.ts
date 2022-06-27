import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { GlobalStore, GlobalState } from './global.store';

@Injectable({ providedIn: 'root' })
export class GlobalQuery extends QueryEntity<GlobalState> {

  constructor(protected store: GlobalStore) {
    super(store);
  }


  get isLoggedIn() {
    return this.getValue().entities?.auth?.loggedIn;
  }
}
