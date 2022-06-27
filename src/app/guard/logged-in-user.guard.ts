import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { GlobalQuery } from '../state/global.query';
import { LocalStorageData } from '../__share/helper/local-storage-data';

@Injectable({
  providedIn: 'root'
})
export class LoggedInUserGuard implements CanActivate {
  
  guard: boolean = false;
  loggedIn: any;

  constructor(
    private globalQuery  : GlobalQuery,
    private router     : Router,
    private localStorageData: LocalStorageData,
  ) {}

  canActivate() {
    this.isLoggedIn();
    return this.guard;
  }

  isLoggedIn() {
    this.loggedIn = this.localStorageData.checkUserExpire('elsfu');
    if (this.loggedIn && this.globalQuery.isLoggedIn) {
      this.guard = false
      this.router.navigate(['/']);
    }
    else {
      this.guard = true;
    }
  }
  
}
