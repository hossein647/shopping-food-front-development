import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CategoryPaginator } from './category-paginator.model';
import { CategoryPaginatorStore } from './category-paginator.store';

@Injectable({ providedIn: 'root' })
export class CategoryPaginatorService {

  baseUrl: string = environment.url;

  constructor(
    private categoryPaginatorStore: CategoryPaginatorStore,
     private http: HttpClient,
     ) {
  }


  getAllCategoryWithPaginate(limit: number, page: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('limit', limit)
    return this.http.get<CategoryPaginator[]>(`${this.baseUrl}/shop-category/paginate`, { 
      params, 
      withCredentials: true,
    }).pipe(
      catchError(err => of(err)),
      tap(entities => this.categoryPaginatorStore.setCategoryWithPaginate(entities))
    );
  }

}
