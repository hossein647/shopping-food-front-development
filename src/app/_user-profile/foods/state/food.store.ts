import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Food } from './food.model';

export interface FoodState extends EntityState<Food> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'food' })
export class FoodStore extends EntityStore<FoodState> {

  constructor() {
    super();
  }
}
