import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { SubFoodStore, SubFoodState } from './sub-food.store';

@Injectable({ providedIn: 'root' })
export class SubFoodQuery extends QueryEntity<SubFoodState> {

  constructor(protected store: SubFoodStore) {
    super(store);
  }

}
