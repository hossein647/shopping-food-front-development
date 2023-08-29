import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Food } from 'src/app/__dashboard/foods/state/food.model';
import { GlobalFront } from '../_interfaces/global-front.interface';

@Injectable({
  providedIn: 'root'
})
export class GlobalFrontService {

  private orderFoods  = new Subject<GlobalFront>();
  public  orderFoods$ = this.orderFoods.asObservable();

  private singleFood  = new Subject<Food>();
  public  singleFood$ = this.singleFood.asObservable();

  constructor() { }

  
  getOrderFood() {
    return this.orderFoods$;
  }


  updateOrderFood(global: GlobalFront) {
    this.orderFoods.next(global);
  }

  lengthOrderFood() {
    return this.orderFoods$.pipe(
      map(foods => {
        let length = 0;
        const arr = [];
        for (const key of Object.keys(foods)) {
          arr.push(Array.from(Object(foods[key])).length);
          length = arr.reduce((prev: number, curr: number) => prev + curr);
        }
        return length;
      })
    )
  }



  getSingleFood() {
    return this.singleFood$;
  }

  setSingleFood(food: Food) {
    return this.singleFood.next(food);
  }


  getEmail(): string {
    if (window.localStorage.getItem('elsfu')) {
      const user = JSON.parse(window.localStorage.getItem?.('elsfu') || '');
      return user.email
    }
    return '';
  }
  
  
  isExistGuest(): boolean {
    return window.localStorage.getItem('orderFood_guest') ? true : false;
  }

  getGuest() {
    return JSON.parse(window.localStorage.getItem?.('orderFood_guest') || '[]');
  }


}
