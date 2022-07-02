import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { FoodCategory } from './food-category.model';

export interface FoodCategoryState extends EntityState<FoodCategory> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'food-catgory' })
export class FoodCategoryStore extends EntityStore<FoodCategoryState> {

  constructor() {
    super();
  }

}
