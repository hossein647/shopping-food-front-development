import { Injectable } from '@angular/core';
import { UiStore } from './ui.store';

@Injectable({ providedIn: 'root' })
export class UiService {

  constructor(private uiStore: UiStore) {
  }

  updateUiSidebar(isOpen: boolean) {
    this.uiStore.update({
      ui: {
        isOpen
      }
    });
  }

}
