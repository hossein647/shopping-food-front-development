import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Ui } from './ui.model';

export interface UiState extends EntityState<Ui> {
  ui: {
    isOpen: boolean;
  };
}

const initialState = {
  ui: { isOpen: true }
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'ui' })
export class UiStore extends EntityStore<UiState, Ui> {

  constructor() {
    super(initialState);
  }

}
