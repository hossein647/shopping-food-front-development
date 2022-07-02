import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { Category } from './category.model';
import { CategoryStore } from './category.store';
import { environment } from './../../../../environments/environment'
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryService {

  baseUrl: string =  environment.url;

  constructor(
    private categoryStore: CategoryStore,
    private http: HttpClient,
    ) {}


  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/shop-category/getAll`, { withCredentials: true })
    .pipe(
      tap(entities => {
        this.categoryStore.set(entities);
    }));
  }


  create(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/shop-category/create`, category, { withCredentials: true})
    .pipe(
      tap(entities => {
        this.categoryStore.update(entities);
      })
    )
  }
  
  
  update(id: number, category: Category): Observable<Category> {
    const params = new HttpParams().set('id', id);
    return this.http.put<Category>(`${this.baseUrl}/shop-category/update`, category, {
      params,
      withCredentials: true,
    })
    .pipe(
      tap(entity => {
        this.categoryStore.update(entity);
      })
    )
  }

  remove(id: number) {
    const params = new HttpParams().set('id', id);
    return this.http.delete(`${this.baseUrl}/shop-category/remove`, { params, withCredentials: true })
    .pipe(
      tap(entity => {
        this.categoryStore.update(entity);
      })
    )
  }



  getPopulatedPrivateImages() {
    return this.http.get(`${this.baseUrl}/shop-category/populated-private-image`, { withCredentials: true })
      .pipe(
        catchError(err => of(err))
      )
  }

}
