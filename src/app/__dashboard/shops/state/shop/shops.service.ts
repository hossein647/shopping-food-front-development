import { environment } from './../../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { Shop } from './shop.model';
import { ShopsStore } from './shops.store';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShopsService {

  baseUrl = environment.url
  constructor(
    private shopsStore: ShopsStore,
    private http: HttpClient,
    ) {
  }


  getAllPrivate() {
    return this.http.get<Shop[]>(`${this.baseUrl}/shops/private-shops`, { withCredentials: true })
    .pipe(
      catchError(err => of(err))
    )
  }
  
  
  
  // getAllPublic() {
  //   return this.http.get(`${this.baseUrl}/shops/public-shops`).pipe(
  //     catchError(err => of(err))
  //   )
  // }



  getAllWithPaginate() {
    return this.http.get<Shop[]>(`${this.baseUrl}/shops/public-paginate`).pipe(
      catchError(err => of(err))
    )
  }



  create(shop: Shop) {
    return this.http.post<Shop>(`${this.baseUrl}/shops/create`, shop, { withCredentials: true }).pipe(
      tap(entities => this.shopsStore.update(entities)),
    )
  }



  update(id: number, data: Shop) {    
    const params = new HttpParams().set('id', id);
    return this.http.put(`${this.baseUrl}/shops/update`, data, { params, withCredentials: true }).pipe(
      tap(entiteis => this.shopsStore.update(entiteis))
    )
  }



  remove(id: number) {
    const params = new HttpParams().set('id', id)
    return this.http.delete(`${this.baseUrl}/shops/remove`, { params, withCredentials: true}).pipe(
      tap(entitis => this.shopsStore.update(entitis))
    )
  }

}
