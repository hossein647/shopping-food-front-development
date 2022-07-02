import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { OrderFood } from '../_interfaces/order-food.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderFoOdService {

  addressApi: string = environment.url;

  constructor(
    private http: HttpClient,
  ) { }


  create(orderFood: OrderFood) {    
    return this.http.post<OrderFood>(`${this.addressApi}/order-food/create`, orderFood, { withCredentials: true })
    .pipe(
      catchError(err => of(err))
    )
  }
}
