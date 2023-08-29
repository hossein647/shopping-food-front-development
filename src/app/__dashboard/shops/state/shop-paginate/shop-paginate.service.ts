import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ShopPaginate } from './shop-paginate.model';
import { ShopPaginateStore } from './shop-paginate.store';

@Injectable({ providedIn: 'root' })
export class ShopPaginateService {

  baseUrl = environment.url;
  
  constructor(private shopPaginateStore: ShopPaginateStore, private http: HttpClient) {
  }

  getAllShopWithPaginate(limit: number, page: number): Observable<any> {
    const params = new HttpParams()
    .set('page', page)
    .set('limit', limit)
    return this.http.get<ShopPaginate[]>(`${this.baseUrl}/shops/private-paginate`, { 
      params, withCredentials: true 
    })
    .pipe(
      catchError(err => of(err)),
      tap(entities => this.shopPaginateStore.setShopsWithPaginate(entities))
    );
  }
}
