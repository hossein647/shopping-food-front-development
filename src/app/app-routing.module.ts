
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgetPasswordComponent } from './auth/forget-password/forget-password.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { AuthGuard } from './guard/auth.guard';
import { LoggedInUserGuard } from './guard/logged-in-user.guard';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: '', loadChildren: () => import('./front/front.module').then(m => m.FrontModule)},
  { 
    path: '', 
    loadChildren: () => import('./_user-profile/user-profile.module').then(m => m.UserProfileModule), 
    canActivate: [AuthGuard]
  },
  { path: 'login',    component: LoginComponent,    canActivate: [LoggedInUserGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [LoggedInUserGuard] },
  { path: 'forget-password', component: ForgetPasswordComponent, canActivate: [LoggedInUserGuard] },
  { path: 'reset-password',  component: ResetPasswordComponent,  canActivate: [LoggedInUserGuard] },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}