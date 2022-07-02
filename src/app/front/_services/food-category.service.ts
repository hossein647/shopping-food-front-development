import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FoodCategoryService {

  apiAddress = environment.url;
  
  constructor(
    private http: HttpClient,
  ) { }


  getAllByShopCategory(shopCategory: string) {
    const params = new HttpParams().set('shopCategory', shopCategory)
    return this.http.get(`${this.apiAddress}/food-category/get-All-by-shop-category`, { params })
      .pipe(
        catchError(err => of(err))
      )
  }
}
