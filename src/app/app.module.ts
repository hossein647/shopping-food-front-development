// import { CommonModule } from '@angular/common';
import { FrontModule } from './front/front.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserProfileModule } from './__dashboard/user-profile.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatInputModule } from '@angular/material/input';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { environment } from 'src/environments/environment';
import { AlertComponent } from './___share/module/alert/alert.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './guard/auth.guard';
import { SellerLoginComponent } from './auth/seller/login/seller-login.component';
import { CustomerRegisterComponent } from './auth/customer/register/customer-register.component';
import { SellerRegisterComponent } from './auth/seller/register/seller-register.component';
import { CustomerLoginComponent } from './auth/customer/login/customer-login.component';
import { SpinnerModule } from './___share/module/spinner/spinner.module';
import { LoginComponent } from './auth/login/login.component';
import { MatTabsModule } from '@angular/material/tabs';
import { BarRatingModule } from "ngx-bar-rating";
import { RegisterComponent } from './auth/register/register.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ForgetPasswordComponent } from './auth/forget-password/forget-password.component';
// import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';


@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    AlertComponent,
    CustomerLoginComponent,
    SellerLoginComponent,
    CustomerRegisterComponent,
    SellerRegisterComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    ForgetPasswordComponent,
  ],
  imports: [
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    FrontModule,
    UserProfileModule,
    BrowserAnimationsModule,
    MatInputModule,
    ReactiveFormsModule,
    SpinnerModule,
    MatTabsModule,
    BarRatingModule,
    MatCardModule,
    MatButtonModule,
    // NgxSkeletonLoaderModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
