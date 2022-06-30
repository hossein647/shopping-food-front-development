import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { tap } from 'rxjs/operators';
import { Global } from './global.model';
import { GlobalStore } from './global.store';

@Injectable({ providedIn: 'root' })
export class GlobalService {

  constructor(private globalStore: GlobalStore) {
  }

  set(auth: Global) {
    return this.globalStore.set({ auth });
  }

  update(auth: Global) {
    return this.globalStore.update({ entities: { auth }})
  }

}