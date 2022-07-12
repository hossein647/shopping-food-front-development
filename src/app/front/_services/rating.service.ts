import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Food } from 'src/app/__dashboard/foods/state/food.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  apiAddress: string = environment.url;

  constructor(
    private http: HttpClient,
  ) { }


  update(id: number, rate: number) {
    const params = new HttpParams().set('id', id);
    return this.http.put<Food>(`${this.apiAddress}/foods/update/rate`,{ rate },
    { params, withCredentials: true })
    .pipe(
      catchError(err => of(err))
    )
  }


  setRateUser(id: number) {
    const params = new HttpParams().set('id', id);
    return this.http.get(`${this.apiAddress}/foods/get/rate`, { params, withCredentials: true }).pipe(
      catchError(err => of(err))
    )
  }
  
  
  getAverageRate(id: number) {
    const params = new HttpParams().set('id', id);
    return this.http.get(`${this.apiAddress}/foods/get/average-rate`, { params }).pipe(
      catchError(err => of(err))
    )
  }


  shopRating(shopName: string) {
    const params = new HttpParams().set('shop', shopName);
    return this.http.get(`${this.apiAddress}/foods/get/shop-rate`, { params })
    .pipe(
      catchError(err => of(err))
    )
  }
}
