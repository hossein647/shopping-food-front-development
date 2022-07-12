import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { SubFood } from './sub-food.model';

export interface SubFoodState extends EntityState<SubFood> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'sub-food' })
export class SubFoodStore extends EntityStore<SubFoodState> {

  constructor() {
    super();
  }

}
