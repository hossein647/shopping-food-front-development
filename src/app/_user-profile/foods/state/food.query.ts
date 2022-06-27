import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { FoodStore, FoodState } from './food.store';

@Injectable({ providedIn: 'root' })
export class FoodQuery extends QueryEntity<FoodState> {

  constructor(protected store: FoodStore) {
    super(store);
  }

}
