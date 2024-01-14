import { Injectable } from '@angular/core';
import { Global } from './global.model';
import { GlobalStore } from './global.store';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class GlobalService {

  baseApi = environment.url;
  private uploadCenter = new BehaviorSubject<any>('null');
  uploadCenter$ = this.uploadCenter.asObservable();

  constructor(
    private globalStore: GlobalStore,
    private http: HttpClient,
    ) {
  }

  set(auth: Global) {
    return this.globalStore.set({ auth });
  }

  update(auth: Global) {
    return this.globalStore.update({ entities: { auth }})
  }


  getSetting() {
    return this.http.get(`${this.baseApi}/setting/get`)
      .pipe(
        tap((res: any) => {
          this.uploadCenter.next(res)
          return res;
        }),
        catchError(err => throwError(() => of(err)))
      )
  }
}
