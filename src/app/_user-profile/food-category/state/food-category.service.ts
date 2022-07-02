import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { FoodCategory } from './food-category.model';
import { FoodCategoryStore } from './food-category.store';

@Injectable({ providedIn: 'root' })
export class FoodCategoryService {

  baseUrl: string = environment.url;
  
  constructor(private foodCategoryStore: FoodCategoryStore, private http: HttpClient) {
  }


  getAllCategoryWithPaginate(limit: number, page: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('limit', limit)
    return this.http.get<any[]>(`${this.baseUrl}/food-category/paginate`, {
      params,
      withCredentials: true,
    }).pipe(
      catchError(err => of(err)),
      tap(entities => this.foodCategoryStore.set(entities))
    );
  }


  getAll(): Observable<FoodCategory[]> {
    return this.http.get<FoodCategory[]>(`${this.baseUrl}/food-category/getAll`, { withCredentials: true });
  }


  create(foodCategory: FoodCategory): Observable<FoodCategory> {
    return this.http.post<FoodCategory>(`${this.baseUrl}/food-category/create`, foodCategory, { withCredentials: true })
      .pipe(
        tap(entities => {
          this.foodCategoryStore.update(entities);
        })
      )
  }


  update(id: number, foodCategory: FoodCategory): Observable<FoodCategory> {
    const params = new HttpParams().set('id', id);
    return this.http.put<FoodCategory>(`${this.baseUrl}/food-category/update`, foodCategory, {
      params,
      withCredentials: true,
    })
      .pipe(
        tap(entity => {
          this.foodCategoryStore.update(entity);
        })
      )
  }

  remove(id: number) {
    const params = new HttpParams().set('id', id);
    return this.http.delete(`${this.baseUrl}/food-category/remove`, { params, withCredentials: true })
      .pipe(
        tap(entity => {
          this.foodCategoryStore.update(entity);
        })
      )
  }



  filterShopCategory(name: string) {
    const params = new HttpParams().set('name', name)
    return this.http.get(`${this.baseUrl}/food-category/filter-shop-category`, 
    { params , withCredentials: true})
    .pipe(
      catchError(err => of(err)),
      tap(entity => {
        this.foodCategoryStore.update(entity);
      }),
    )
  }

}
