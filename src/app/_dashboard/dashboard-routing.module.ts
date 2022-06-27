import { UsersComponent } from './users/users.component';
import { FoodCategoryComponent } from './food-category/food-category.component';
import { FoodsComponent } from './foods/foods.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'dashboard', component: HomeComponent, children: [
    {path: 'categories', component: FoodCategoryComponent},
    {path: 'users', component: UsersComponent},
    {path: 'foods', component: FoodsComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
