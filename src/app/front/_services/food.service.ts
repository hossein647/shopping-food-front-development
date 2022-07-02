import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  apiAddress = environment.url;

  constructor(
    private http: HttpClient,
  ) {}


  getAllByShopId(id: number) {
    const params = new HttpParams().set('id', id);

    return this.http.get(`${this.apiAddress}/foods/getAll/by-shop-id`, { params })
    .pipe(
      catchError(err => of(err))
    )
  }
}
