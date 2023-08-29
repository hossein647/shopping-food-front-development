import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { FoodService } from 'src/app/front/_services/food.service';
import { Shop } from 'src/app/__dashboard/shops/state/shop/shop.model';

@Injectable({
  providedIn: 'root'
})
export class ShopResolver implements Resolve<Shop> {

  constructor(
    private foodService: FoodService,
    private location: Location,
  ) {}

  resolve(activatedRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Shop> { 
    
    return this.foodService.getAllByShopId(activatedRoute.params.id)
    .pipe(
      map(foods => {
        activatedRoute.queryParams.subscribe((value: any) => {          
        });
        
        if (foods.foods) return foods;
        else this.location.back();
      }),
      catchError(err => of(err))
    )
  }
}
