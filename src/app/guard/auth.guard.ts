import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { GlobalQuery } from '../state/global.query';
import { LocalStorageData } from '../___share/helper/local-storage-data';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  
  constructor(
    private globalQuery: GlobalQuery,
    private router: Router,
    private localStorageData: LocalStorageData,
    ) {}
    
    canActivate(route: ActivatedRouteSnapshot): boolean {
    const user = this.localStorageData.checkUserExpire('elsfu');
    if (user && this.globalQuery.isLoggedIn) return true;
    this.router.navigate(['/']);
    return false;
  }

}
