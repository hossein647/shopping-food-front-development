import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/auth/state/user.service';
import { LocalStorageData } from 'src/app/___share/helper/local-storage-data';

@Component({
  selector: 'app-categories',
  templateUrl: './shop-categories.component.html',
  styleUrls: ['./shop-categories.component.scss']
})
export class ShopCategoriesComponent implements OnInit {

  constructor(
    private localStorageData: LocalStorageData,
    private router          : Router,
    private userService     : UserService,
  ) { }

  ngOnInit(): void {
    this.checkUserExpire();    
    if (!this.checkUserExpire()) this.router.navigate(['/']);
  }

  checkUserExpire() {
    return this.localStorageData.checkUserExpire('elsfu');
  }

}
