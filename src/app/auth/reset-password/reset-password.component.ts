import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Snackbar } from 'src/app/___share/helper/snackbar';
import { UserService } from '../state/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetForm            : FormGroup;
  newPasswordError     : string;
  confirmPasswordError : string;
  error                : any = true;
  params: any;

  constructor(
    private userService   : UserService,
    private formBuilder   : FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router        : Router,
    private _snackbar     : Snackbar,
  ) { }

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group({
      newPassword    : ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    }, { validator: this.checkPassword });

    this.validResetToken()
  }


  resetPassword(resetForm: FormGroup) {
    const body = {
      token: this.params.token,
      id   : this.params.id,
      newPass: resetForm.value.newPassword
    }

    this.userService.resetPassword(body).subscribe(
      res => {
        if (res) {
          this._snackbar.addSnackbar(res.message, res?.err, 3000)
          if (!res?.err) this.router.navigate(['/'])
        }
      }
    )
  }


  validResetToken() {
    this.activatedRoute.queryParams.subscribe(
      params => {
        this.params = params;
        this.userService.validResetToken(params.token, params.id).subscribe(
          res => {
            if (res) {           
              this.error = res?.message || res?.err?.message ? res : false;
            }
          }
        )
      }
    )
  }

  checkPassword(control: AbstractControl): ValidationErrors | null {
    const password = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notSame: true }
  }
}
