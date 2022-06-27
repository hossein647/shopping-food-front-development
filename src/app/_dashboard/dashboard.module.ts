import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomeComponent } from './home/home.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSidenavModule} from '@angular/material/sidenav';
import { HeaderComponent } from './header/header.component';
import {MatIconModule} from '@angular/material/icon';
import { UsersComponent } from './users/users.component';
import { FoodsComponent } from './foods/foods.component';
import { FoodCategoryComponent } from './food-category/food-category.component';


@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    UsersComponent,
    FoodsComponent,
    FoodCategoryComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatGridListModule,
    MatSidenavModule,
    MatIconModule
  ],
  exports: [
    HomeComponent,
    HeaderComponent,
    UsersComponent,
    FoodsComponent,
    FoodCategoryComponent,
  ]
})
export class DashboardModule { }
