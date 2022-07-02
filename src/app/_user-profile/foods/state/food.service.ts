import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Food } from './food.model';
import { FoodStore } from './food.store';

@Injectable({ providedIn: 'root' })
export class FoodService {

  baseUrl: string = environment.url;

  constructor(
    private foodStore: FoodStore, 
    private http: HttpClient) {
  }


  paginateFoods(limit: number, page: number) {
    const params = new HttpParams()
    .set('limit', limit)
    .set('page', page);
    return this.http.get<Food[]>(`${this.baseUrl}/foods/getAll/paginate-food`, { params, withCredentials: true })
    .pipe(
      catchError(err => of(err)),
      tap(entities => this.foodStore.set(entities)));
  }
  
  
  paginateSuperFoods(limit: number, page: number) {
    const params = new HttpParams()
    .set('limit', limit)
    .set('page', page);
    return this.http.get<Food[]>(`${this.baseUrl}/foods/getAll/paginate-super-foods`, { params, withCredentials: true })
    .pipe(
      catchError(err => of(err)),
      tap(entities => this.foodStore.set(entities)));
  }

  create(food: Food) {
    return this.http.post<Food>(`${this.baseUrl}/foods/add`, food, {withCredentials: true});
  }

  update(id: number, food: Food) {    
    const params = new HttpParams().set('id', id);
    return this.http.put<Food>(`${this.baseUrl}/foods/update`, food, { params, withCredentials: true})
  }

  remove(id: number) {
    const params = new HttpParams().set('id', id);
    return this.http.delete(`${this.baseUrl}/foods/remove`, { params, withCredentials: true});
  }

  getById(id: number) {
    const params = new HttpParams().set('id', id);
    return this.http.get<Food>(`${this.baseUrl}/foods/get`, { params, withCredentials: true});
  }

  confirm(id: number) {
    const params = new HttpParams().set('id', id);
    return this.http.put<Food>(`${this.baseUrl}/foods/update/confirm`, {}, { params, withCredentials: true });
  }
  
  reject(id: number) {
    const params = new HttpParams().set('id', id);
    return this.http.put<Food>(`${this.baseUrl}/foods/update/reject`, {}, { params, withCredentials: true });
  }

  reset(id: number) {
    const params = new HttpParams().set('id', id);
    return this.http.put<Food>(`${this.baseUrl}/foods/update/reset`, {}, { params, withCredentials: true });
  }


  getPopulatedComment(id: number) {
    const params = new HttpParams().set('id', id);
    return this.http.get(`${this.baseUrl}/foods/populated-comment`, { params })
    .pipe(
      catchError(err => of(err))
    )
  }
  
  
  getPopulatedPublicImages(id: number) {
    const params = new HttpParams().set('id', id);
    return this.http.get(`${this.baseUrl}/foods/populated-public-image`, { params })
    .pipe(
      catchError(err => of(err))
    )
  }
  
  
  getPopulatedPrivateImages() {
    return this.http.get(`${this.baseUrl}/foods/populated-private-image`, { withCredentials: true })
    .pipe(
      catchError(err => of(err))
    )
  }

}
