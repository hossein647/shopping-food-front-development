import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageData } from 'src/app/___share/helper/local-storage-data';

@Component({
  selector: 'app-foods',
  templateUrl: './foods.component.html',
  styleUrls: ['./foods.component.scss']
})
export class FoodsComponent implements OnInit {

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
