import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageData } from 'src/app/___share/helper/local-storage-data';


@Component({
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.scss']
})
export class ShopsComponent implements OnInit {
  
  expire: any;

  constructor(
    private localStorageData: LocalStorageData,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.checkUserExpire();
    if (!this.checkUserExpire()) this.router.navigate(['/']);
  }

  checkUserExpire() {
    return this.localStorageData.checkUserExpire('elsfu');
  }

}
