import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Circular } from './circular.model';

export interface CircularState extends EntityState<Circular> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'circular' })
export class CircularStore extends EntityStore<CircularState> {

  constructor() {
    super();
  }

}
