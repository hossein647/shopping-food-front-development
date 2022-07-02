import { CommonModule } from '@angular/common';
import { FrontModule } from './front/front.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardModule } from './_dashboard/dashboard.module';
import { UserProfileModule } from './_user-profile/user-profile.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatInputModule } from '@angular/material/input';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { environment } from 'src/environments/environment';
import { AlertComponent } from './__share/module/alert/alert.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './guard/auth.guard';
import { SignFormComponent } from './auth/sign-form/sign-form.component';
import { SellerLoginComponent } from './auth/seller/login/seller-login.component';
import { CustomerRegisterComponent } from './auth/customer/register/customer-register.component';
import { SellerRegisterComponent } from './auth/seller/register/seller-register.component';
import { CustomerLoginComponent } from './auth/customer/login/customer-login.component';
import { SpinnerModule } from './__share/module/spinner/spinner.module';
import { LoginComponent } from './auth/login/login.component';
import { MatTabsModule } from '@angular/material/tabs';
import { BarRatingModule } from "ngx-bar-rating";
import { RegisterComponent } from './auth/register/register.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ForgetPasswordComponent } from './auth/forget-password/forget-password.component';


@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    AlertComponent,
    SignFormComponent,
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
    CommonModule,
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    FrontModule,
    UserProfileModule,
    DashboardModule,
    BrowserAnimationsModule,
    MatInputModule,
    ReactiveFormsModule,
    SpinnerModule,
    MatTabsModule,
    BarRatingModule,
    MatCardModule,
    MatButtonModule,
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
