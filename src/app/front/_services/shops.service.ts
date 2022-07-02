import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Shop } from 'src/app/_user-profile/shops/state/shop/shop.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopsService {

  apiAddress = environment.url;
  shops = new Subject<any>()
  shops$ = this.shops.asObservable();

  constructor(
    private http: HttpClient,
  ) { }


  getAll(category: string, limit: number, page: number) {
    const params = new HttpParams()
    .set('limit', limit)
    .set('page', page)
    .set('category', category);    
    return this.http.get(`${this.apiAddress}/shops/public-paginate`, { params })
    .pipe(
      catchError(err => of(err))
    )
  }


  setShops(category: string, limit: number, page: number) {                     
    this.getAll(category, limit, page).subscribe(
      res => {
        if (res) this.shops.next(res);
      }
    )
  }

  
  setSubFoodCategory(res: any) {
    this.shops.next(res)
  }


  getShops() {
    return this.shops$;
  }



  getAllByCategoryAndDescription(category: string, description: string, limit: number, page: number) {
    const params = new HttpParams()
    .set('category', category)
    .set('description', description)
    .set('limit', limit)
    .set('page', page)
    return this.http.get(`${this.apiAddress}/shops/get-all-by-category-description`, { params })
    .pipe(
      catchError(err => of(err))
    )
  }


  getSingleShops(id: number) {
    const params = new HttpParams().set('id', id);
    return this.http.get(`${this.apiAddress}/shops/get/single`, { params })
    .pipe(
      catchError(err => of(err))
    )
  }
}
