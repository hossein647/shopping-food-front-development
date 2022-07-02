import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Global } from './global.model';

export interface GlobalState extends EntityState<Global> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'global' })
export class GlobalStore extends EntityStore<GlobalState> {

  constructor() {
    super();
  }

}
