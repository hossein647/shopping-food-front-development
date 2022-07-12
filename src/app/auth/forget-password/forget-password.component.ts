import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Snackbar } from 'src/app/___share/helper/snackbar';
import { UserService } from '../state/user.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  email: FormControl;
  emailError: string

  constructor(
    private userService: UserService,
    private _snackbar  : Snackbar,
  ) { }

  ngOnInit(): void {
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.emailError = 'ایمیل معتبر وارد کنید';
  }


  submit(email: FormControl) {    
    this.userService.forgetPassword(email.value).subscribe(
      res => {
        if (res) {
          this._snackbar.addSnackbar(res.message, res.err, 3000);
          if (!res.err) this.email.reset()
        }
      }
    )
  }

}
