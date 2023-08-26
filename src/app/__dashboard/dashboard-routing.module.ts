import { ShopsComponent } from './shops/shopes/shops.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { ReadShopsComponent } from './shops/read-shops/read-shops.component';
import { FoodsComponent } from './foods/foods/foods.component';
import { ReadFoodsComponent } from './foods/read-foods/read-foods.component';
import { FoodCategoryComponent } from './food-category/food-category/food-category.component';
import { ReadFoodCategoryComponent } from './food-category/read-food-category/read-food-category.component';
import { UploadComponent } from './upload/upload/upload.component';
import { HomeUploadComponent } from './upload/home-upload/home-upload.component';
import { ReadUploadComponent } from './upload/read-upload/read-upload.component';
import { RoleGuard } from '../guard/role.guard';
import { SuperFoodComponent } from './foods/super-food/super-food.component';
import { ReadSubFoodComponent } from './sub-category-food/read-sub-food/read-sub-food.component';
import { SubFoodComponent } from './sub-category-food/sub-food/sub-food.component';
import { ReadShopCategoriesComponent } from './categories/read-shop-categories/read-shop-categories.component';
import { ShopCategoriesComponent } from './categories/shop-categories/shop-categories.component';
import { FormFoodsComponent } from './foods/form-foods/form-foods.component';
import { FormShopComponent } from './shops/form-shop/form-shop.component';
import { ShopCategoryComponent } from './categories/shop-category/shop-category.component';
import { FoodCategoryFormComponent } from './food-category/food-category-form/food-category-form.component';
import { ProfileComponent } from './profile/profile.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';

const routes: Routes = [
  { path: '', component: HomeComponent, children: [
    { 
      path: 'profile', 
      component: ProfileComponent, 
      canActivate: [RoleGuard], 
      data: { role: ['seller', 'admin', 'customer']}
    },
    { path: 'shops', component: ShopsComponent,
      children: [
        { path: '', component: ReadShopsComponent },
        {
          path: 'create',
          component: FormShopComponent,
          canActivate: [RoleGuard],
          data: { role: ['seller']}
        },
        {
          path: 'edit/:id',
          component: FormShopComponent,
          canActivate: [RoleGuard],
          data: { role: ['seller'] }
        },
      ]
    },
    { 
      path: 'users', 
      component: UsersComponent 
    },
    { path: 'categories', component: ShopCategoriesComponent,
      children: [
        { path: '', component: ReadShopCategoriesComponent },
        {
          path: 'create',
          component: ShopCategoryComponent,
          canActivate: [RoleGuard],
          data: { role: ['admin'] }
        },
        {
          path: 'edit/:id',
          component: ShopCategoryComponent,
          canActivate: [RoleGuard],
          data: { role: ['admin'] }
        },
      ]
    },
    { path: 'foods', component: FoodsComponent,
      children: [
        { path: '', component: ReadFoodsComponent },
        {
          path: 'create',
          component: FormFoodsComponent,
          canActivate: [RoleGuard],
          data: { role: ['seller'] }
        },
        {
          path: 'edit/:id',
          component: FormFoodsComponent,
          canActivate: [RoleGuard],
          data: { role: ['seller'] }
        },
      ]
    },
    { 
      path: 'sub-foods', 
      component: FoodsComponent,
        children: [
          { path: '', component: ReadSubFoodComponent },
          {
            path: 'create',
            component: SubFoodComponent,
            canActivate: [RoleGuard],
            data: { role: ['seller'] }
          },
          {
            path: 'edit/:id',
            component: SubFoodComponent,
            canActivate: [RoleGuard],
            data: { role: ['seller'] }
          },
        ]
    },
    {
      path: 'super-food',
      component: SuperFoodComponent,
      canActivate: [RoleGuard],
      data: { role: ['admin']}
    },
    {
      path: 'food-category', component: FoodCategoryComponent,
      children: [
        { path: '', component: ReadFoodCategoryComponent },
        {
          path: 'create',
          component: FoodCategoryFormComponent,
          canActivate: [RoleGuard],
          data: { role: ['admin'] }  },
        {
          path: 'edit/:id',
          component: FoodCategoryFormComponent,
          canActivate: [RoleGuard],
          data: { role: ['admin'] }
        },
    ]},
    { 
      path: 'payment-history', 
      component: PaymentHistoryComponent, 
      canActivate: [RoleGuard],
      data: { role: ['customer'] },
    },
    { 
      path: 'home-upload', 
      component: HomeUploadComponent, 
      children: [
        { 
          path: '', 
          component: ReadUploadComponent,
          canActivate: [RoleGuard],
          data: { role: ['seller', 'admin', 'customer'] }
        },
        { 
          path: 'upload', 
          component: UploadComponent,
          canActivate: [RoleGuard],
          data: { role: ['seller', 'admin', 'customer'] }
        }
      ]
    },
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class dashboardRoutingModule { }
