import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { FoodCategoryStore, FoodCategoryState } from './food-category.store';

@Injectable({ providedIn: 'root' })
export class FoodCategoryQuery extends QueryEntity<FoodCategoryState> {

  constructor(protected store: FoodCategoryStore) {
    super(store);
  }

}
