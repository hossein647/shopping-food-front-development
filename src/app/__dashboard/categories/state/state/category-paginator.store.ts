import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { CategoryPaginator } from './category-paginator.model';

export interface CategoryPaginatorState extends EntityState<CategoryPaginator> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'category-paginator' })
export class CategoryPaginatorStore extends EntityStore<CategoryPaginatorState> {

  constructor() {
    super();
  }

  setCategoryWithPaginate(shops: CategoryPaginator[]) {
    this.set(shops);
    this.update(state => ({ ...state }))
  }

}
