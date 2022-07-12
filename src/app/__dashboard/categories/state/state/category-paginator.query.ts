import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { CategoryPaginatorStore, CategoryPaginatorState } from './category-paginator.store';

@Injectable({ providedIn: 'root' })
export class CategoryPaginatorQuery extends QueryEntity<CategoryPaginatorState> {

  constructor(protected store: CategoryPaginatorStore) {
    super(store);
  }

}
