import { CommonFormCreateComponent } from './common-form-create/common-form-create.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { dashboardRoutingModule } from './dashboard-routing.module';
import { SettingComponent } from './setting/setting.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { UsersComponent } from './users/users.component';
import { ShopsComponent } from './shops/shopes/shops.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReadShopsComponent } from './shops/read-shops/read-shops.component';
import { LayoutModule} from '@angular/cdk/layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from '../___share/module/table/table.module';
import { UploadComponent } from './upload/upload/upload.component';
import { FormShopComponent } from './shops/form-shop/form-shop.component';
import { ShopCategoryComponent } from './categories/shop-category/shop-category.component';
import { FoodsComponent } from './foods/foods/foods.component';
import { FormFoodsComponent } from './foods/form-foods/form-foods.component';
import { ReadFoodsComponent } from './foods/read-foods/read-foods.component';
import { MatMenuModule } from '@angular/material/menu';
import { FoodCategoryFormComponent } from './food-category/food-category-form/food-category-form.component';
import { FoodCategoryComponent } from './food-category/food-category/food-category.component';
import { ReadFoodCategoryComponent } from './food-category/read-food-category/read-food-category.component';
import { ReadUploadComponent } from './upload/read-upload/read-upload.component';
import { HomeUploadComponent } from './upload/home-upload/home-upload.component';
import { ImageDialogBoxComponent } from './upload/image-dialog-box/image-dialog-box.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SuperFoodComponent } from './foods/super-food/super-food.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ReadSubFoodComponent } from './sub-category-food/read-sub-food/read-sub-food.component';
import { SubFoodComponent } from './sub-category-food/sub-food/sub-food.component';
import { MatChipsModule } from '@angular/material/chips';
import { ReadShopCategoriesComponent } from './categories/read-shop-categories/read-shop-categories.component';
import { ShopCategoriesComponent } from './categories/shop-categories/shop-categories.component';
// import { SpinnerModule } from '../___share/module/spinner/spinner.module';
import { ProfileComponent } from './profile/profile.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component'; 
import { MatCardModule } from '@angular/material/card';
import { SpinnerModule } from '../___share/module/spinner/spinner.module';

@NgModule({
  declarations: [
    SettingComponent,
    HeaderComponent,
    HomeComponent,
    UsersComponent,
    FoodsComponent,
    ShopsComponent,
    ShopCategoryComponent,
    ReadShopsComponent,
    CommonFormCreateComponent,
    UploadComponent,
    FormShopComponent,
    ReadShopCategoriesComponent,
    ShopCategoriesComponent,
    ShopCategoryComponent,
    FormFoodsComponent,
    ReadFoodsComponent,
    FoodCategoryComponent,
    ReadFoodCategoryComponent,
    FoodCategoryFormComponent,
    ReadUploadComponent,
    HomeUploadComponent,
    ImageDialogBoxComponent,
    SuperFoodComponent,
    ReadSubFoodComponent,
    SubFoodComponent, 
    FormFoodsComponent,
    FormShopComponent,
    ProfileComponent,
    PaymentHistoryComponent,
  ],
  imports: [
    CommonModule,
    dashboardRoutingModule,
    MatSidenavModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    LayoutModule,
    ReactiveFormsModule,
    MatSelectModule,
    HttpClientModule,
    TableModule,
    MatMenuModule,
    MatDialogModule,
    MatButtonModule,
    MatTooltipModule,
    MatStepperModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatChipsModule,
    SpinnerModule,
    MatCardModule
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {
        colse: (dialogRef: any) => {}
      }
    },
  ],
})
export class UserProfileModule { }
