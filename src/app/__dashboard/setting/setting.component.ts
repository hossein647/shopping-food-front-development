import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/auth/state/user.service';
import { LocalStorageData } from 'src/app/___share/helper/local-storage-data';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

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
