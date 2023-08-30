import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatInputModule } from '@angular/material/input';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { environment } from 'src/environments/environment';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './guard/auth.guard';
import { SignFormComponent } from './auth/sign-form/sign-form.component';
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
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';


@NgModule({
  declarations: [
    AppComponent,
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
    BrowserAnimationsModule,
    MatInputModule,
    ReactiveFormsModule,
    SpinnerModule,
    MatTabsModule,
    BarRatingModule,
    MatCardModule,
    MatButtonModule,
    HttpClientModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  providers: [
    AuthGuard,
    {
      provide: MatDialogRef,
      useValue: {
        colse: (dialogRef: any) => { }
      }
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
