import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  apiAddress: string = environment.url;

  constructor(
    private http: HttpClient,
  ) { }

  updatePassword(body: any) {
    return this.http.put(`${this.apiAddress}/users/user/update/password`, 
      body, 
      { withCredentials: true }
    ).pipe(
      catchError(err => of(err))
    )
  }

  getUser() {
    return this.http.get(`${this.apiAddress}/users/user/get/by-id`, { withCredentials: true })
    .pipe(
      catchError(err => of(err))
    )
  }

}
