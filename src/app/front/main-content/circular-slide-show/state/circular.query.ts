import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { CircularStore, CircularState } from './circular.store';

@Injectable({ providedIn: 'root' })
export class CircularQuery extends QueryEntity<CircularState> {

  constructor(protected store: CircularStore) {
    super(store);
  }

}
