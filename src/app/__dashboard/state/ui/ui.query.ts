import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { UiStore, UiState } from './ui.store';

@Injectable({ providedIn: 'root' })
export class UiQuery extends QueryEntity<UiState> {
  private selectUi$!: Observable<boolean>;

  constructor(protected store: UiStore) {
    super(store);
  }

  getVisibilityUi() {
    return this.selectUi$ = this.select(state => state.ui.isOpen)
  }
}
