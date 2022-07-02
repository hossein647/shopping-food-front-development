import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Food } from 'src/app/_user-profile/foods/state/food.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  apiAddress = environment.url;

  constructor(
    private http: HttpClient,
  ) { }


  popular() {
    return this.http.get<Food>(`${this.apiAddress}/foods/getAll/popular`)
    .pipe(
      catchError(err => of(err))
    )
  }
  
  
  newest() {
    return this.http.get(`${this.apiAddress}/foods/getAll/newest`)
    .pipe(
      catchError(err => of(err))
    )
  }



}
