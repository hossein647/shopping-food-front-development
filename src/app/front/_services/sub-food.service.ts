import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubFoodService {

  apiAddress = environment.url;

  constructor(
    private http: HttpClient,
  ) { }


  getSubFoods(shopName: string) {
    const params = new HttpParams().set('shop', shopName)
    return this.http.get(`${this.apiAddress}/sub-food-category/getAll/by-shop`, { params })
    .pipe(
      catchError(err => of(err))
    )
  }
}
