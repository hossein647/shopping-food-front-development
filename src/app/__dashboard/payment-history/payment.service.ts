import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  apiAddress: string = environment.url;

  constructor(
    private http: HttpClient
  ) { }


  getAllPaymentsWithPaginage(limit: number, page: number) {
    const params = new HttpParams()
    .set('limit', limit)
    .set('page', page)
    return this.http.get(`${this.apiAddress}/order-food/getAll`, { params, withCredentials: true })
    .pipe(
      catchError(err => of(err))
    )
  }
}
