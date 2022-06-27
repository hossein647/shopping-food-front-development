import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Global } from 'src/app/state/global.model';
import { GlobalService } from 'src/app/state/global.service';
import { LocalStorageData } from 'src/app/__share/helper/local-storage-data';
import { Snackbar } from 'src/app/__share/helper/snackbar';
import { Form } from 'src/app/__share/interface/form.interface';
import { Role, User } from '../../state/user.model';
import { UserService } from '../../state/user.service';

@Component({
  selector: 'app-seller-login',
  templateUrl: './seller-login.component.html',
  styleUrls: ['./seller-login.component.scss']
})
export class SellerLoginComponent implements OnInit {

  title!: string;
  submitLabel!: string;
  goToRegiser!: string;
  loadingSpinner!: boolean;
  allowRequest: boolean = true;
  @Input() show: boolean;

  constructor(
    private userService: UserService,
    private _snackbar: Snackbar,
    private router: Router,
    private globalService: GlobalService,
    private localStorageData: LocalStorageData,
  ) { }

  ngOnInit(): void {
    this.title = 'ورود فروشندگان'
    this.submitLabel = "ورود";
    this.goToRegiser = 'ثبت نام فروشندگان';
  }

  submit(data: Form) {
    this.loadingSpinner = true;
    this.allowRequest = false;
    const requiredRoles: User = {
      email: data.formGroup.value.email,
      password: data.formGroup.value.password,
      role: Role.Seller,
    };
    this.userService.login(requiredRoles).subscribe(
      res => {
        if (res) {     
          console.log('seller login : ', res);
               
          const result = JSON.parse(JSON.stringify(res));
          const auth: Global = { loggedIn: result.loggedIn };
          const expire: number = Number(new Date(result.expire));
          console.log('expire login : ', expire);
          
          this.localStorageData.setLoginExpire(
            'elsfu', 
            expire, 
            result.loggedIn, 
            result.id, 
            result.email, 
            result.role
            ); //  expire_loggedIn_shopping_food_user

          this.loadingSpinner = false;
          this.allowRequest = true;

          this.globalService.set(auth);
          this._snackbar.addSnackbar(result.error?.message || result?.message, result.error, 3000);

          if (!result.error) {
            this.router.navigate(['/']);
            data.ngForm.resetForm();
          }
        }
      },
      err => {
        this.loadingSpinner = false;
        if (err) {
          if (err.error.statusCode === 401) {
            this._snackbar.addSnackbar('ایمیل یا رمز عبور اشتباه است.', true, 3000);
          } else {
            this._snackbar.addSnackbar('خطایی نا مشخص رخ داده است.', true, 3000);
          }
        }
      })
  }

}
