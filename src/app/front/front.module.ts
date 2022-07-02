import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrontRoutingModule } from './front-routing.module';
import { HeaderComponent } from './header/header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { FooterComponent } from './main-content/footer/footer.component';
import { MainContentComponent } from './main-content/main-content/main-content.component';
import { HomeComponent } from './home/home.component';
import { CircularSliderComponent } from './main-content/circular-slide-show/circular-slider/circular-slider.component';
import { SearchBarComponent } from './main-content/search-bar/search-bar.component';
import { MotstPapularComponent } from './main-content/motst-papular/motst-papular.component';
import { NewestComponent } from './main-content/newest/newest.component';
import { BarRatingModule } from "ngx-bar-rating";
import { MoreModalComponent } from './main-content/more-modal/more-modal.component';
import { NotLoginModelComponent } from './main-content/not-login-model/not-login-model.component';
import { SidebarPayComponent } from './sidebar-pay/sidebar-pay.component';
import { PersianDatePipe } from './main-content/more-modal/persian-date.pipe';
import { UsernamePipe } from './main-content/more-modal/username.pipe';
import { WrapperComponent } from './main-content/category/wrapper/wrapper.component';
import { FilterSidebarComponent } from './main-content/category/filter-sidebar/filter-sidebar.component';
import { ShopComponent } from './main-content/category/shop/shop.component';
import { ShopsComponent } from './main-content/category/shops/shops.component';
import { CardShopComponent } from './main-content/category/shop-card/shop-card.component';
import { FoodCardComponent } from './main-content/food-card/food-card.component';
import { SpinnerModule } from '../__share/module/spinner/spinner.module';
import { PriceDividerPipe } from './main-content/food-card/price-divider.pipe';


@NgModule({
  declarations: [
    HeaderComponent,
    MainContentComponent,
    FooterComponent,
    HomeComponent,
    CircularSliderComponent,
    SearchBarComponent,
    MotstPapularComponent,
    NewestComponent,
    MoreModalComponent,
    NotLoginModelComponent,
    SidebarPayComponent,
    PersianDatePipe,
    UsernamePipe,
    WrapperComponent,
    FilterSidebarComponent,
    ShopComponent,
    ShopsComponent,
    CardShopComponent,
    FoodCardComponent,
    PriceDividerPipe,
    
  ],
  imports: [
    CommonModule,
    FrontRoutingModule,
    ReactiveFormsModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatInputModule,
    BarRatingModule,
    SpinnerModule,
  ],
  providers: []

})
export class FrontModule { }
