import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Food } from 'src/app/__dashboard/foods/state/food.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class CircularService {

  baseApi = environment.url;
  urlImage: any;

  constructor(
    private http: HttpClient) 
    {}


  
  getConfirmToday() {
    return this.http.get<Food[]>(`${this.baseApi}/foods/getAll/confirm`, { withCredentials: true });
  }


  getShowStates() {
    return this.http.get<Food[]>(`${this.baseApi}/foods/getAll/show`, { withCredentials: true });
  }
  

  updateToShowState(id: number) {
    return this.http.put<Food>(`${this.baseApi}/foods/update/show`, { id }, { withCredentials: true });
  }

  
  updateToCompleteState() {
    return this.http.put<Food[]>(`${this.baseApi}/foods/update/complete`, {}, { withCredentials: true });
  } 
 
 
  getPopulatedShop(shop: string, name: string) {
    const params = new HttpParams()
    .set('shop', shop)
    .set('name', name)
    return this.http.get(`${this.baseApi}/foods/get/populate-shop`, { params })
    .pipe(
      catchError(err => of(err))
    )
  } 

}
