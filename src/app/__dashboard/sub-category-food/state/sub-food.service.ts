import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { catchError, tap } from 'rxjs/operators';
import { SubFood } from './sub-food.model';
import { SubFoodStore } from './sub-food.store';
import { of } from 'rxjs';
import { FoodService } from '../../foods/state/food.service';

@Injectable({ providedIn: 'root' })
export class SubFoodService {

  apiAddress = environment.url;

  constructor(
    private subFoodStore: SubFoodStore, 
    private http: HttpClient,
    private foodService: FoodService) {
  }


  create(subFood: SubFood) {
    return this.http.post<SubFood>(`${this.apiAddress}/sub-food-category/create`, subFood, { withCredentials: true })
    .pipe(
      catchError(subFood => of(subFood))
    );
  }

  getAllPaginate(limit: number, page: number) {
    const params = new HttpParams()
      .set('page', page)
      .set('limit', limit)
    return this.http.get<any[]>(`${this.apiAddress}/sub-food-category/getAll-paginate`, { params, withCredentials: true })
    .pipe(
      catchError(err => of(err))
    );
  }
  
  
  
  getAll() {
    return this.http.get<any[]>(`${this.apiAddress}/sub-food-category/getAll`, { withCredentials: true })
    .pipe(
      catchError(err => of(err))
    );
  }
  
  
  
  get(id: ID) {
    const params = new HttpParams().set('id', id);    
    return this.http.get<any>(`${this.apiAddress}/sub-food-category/get`, { params, withCredentials: true })
    .pipe(
      catchError(err => of(err))
    );
  }



  update(id: ID, subFood: SubFood) {
    const params = new HttpParams().set('id', id);
    return this.http.put(`${this.apiAddress}/sub-food-category/update`, subFood, { params, withCredentials: true })
    .pipe(
      catchError(err => of(err))
    )
  }

  remove(id: ID) {
    const params = new HttpParams().set('id', id);
    return this.http.delete(`${this.apiAddress}/sub-food-category/remove`, 
      { params, withCredentials: true })
      .pipe(
        catchError(err => of(err))
      );
  }


  filterShop(name: string) {
    const params = new HttpParams().set('name', name);
    return this.http.get(`${this.apiAddress}/sub-food-category/filter-shop`, 
      { params, withCredentials: true })
      .pipe(
        catchError(err => of(err))
      )
  }


}
