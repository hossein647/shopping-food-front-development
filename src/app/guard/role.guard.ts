import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { GlobalQuery } from '../state/global.query';
import { LocalStorageData } from '../___share/helper/local-storage-data';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private globalQuery: GlobalQuery,
    private router: Router,
    private localStorageData: LocalStorageData,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    const roles: string[] = route.data?.role;
    const user = this.localStorageData.checkUserExpire('elsfu');
    
    if (user && this.globalQuery.isLoggedIn) {
      if (roles.some(role => user.role.includes(role))) return true;
    }
    
    this.router.navigate(['/dashboard']);
    return false
  }
}
