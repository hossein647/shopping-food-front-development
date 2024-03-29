import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopCategoryService {

  apiAddress = environment.url;
  
  constructor(
    private http: HttpClient,
  ) { }


  getAll(uploadCenter: string) {
    return this.http.get(`${this.apiAddress}/shop-category/getAll-${uploadCenter}`)
    .pipe(
      catchError(err => of(err))
    )
  }

}
