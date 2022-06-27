import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from './user.model';
import { UserStore } from './user.store';

@Injectable({ providedIn: 'root' })
export class UserService {

  baseUrl: string = environment.url;

  constructor(
    private userStore: UserStore,
    private http: HttpClient,
  ) {}


  register(user: User) {
    return this.http.post<User>(`${this.baseUrl}/auth/register`, user);
  }


  login(user: User) {
    return this.http.post<User>(`${this.baseUrl}/auth/login`, user, {withCredentials: true}).pipe(
      tap(entity => this.userStore.set({entity})),
      catchError(err => of(err))
    );
  }

  hasCookie() {
    return this.http.get(`${this.baseUrl}/auth/has-cookie`, { withCredentials: true });
  }

  logout() {
    return this.http.get<User>(`${this.baseUrl}/auth/logout`, { withCredentials: true });
  }



  forgetPassword(email: string) {
    return this.http.post(`${this.baseUrl}/auth/forget-password`, { email })
    .pipe(
      catchError(err => of(err))
    )
  }
  
  
  
  validResetToken(token: string, id: number) {
    const params = new HttpParams()
    .set('token', token)
    .set('id', id)
    return this.http.get(`${this.baseUrl}/auth/valid-password`, { params })
    .pipe(
      catchError(err => of(err))
    )
  }



  resetPassword(body: { token: string, id: number, newPass: string }) {
    return this.http.post(`${this.baseUrl}/auth/reset-password`, body)
      .pipe(
        catchError(err => of(err))
      )
  }
}
