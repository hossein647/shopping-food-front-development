import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { User } from 'src/app/auth/state/user.model';
import { Snackbar } from 'src/app/___share/helper/snackbar';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  changePassowrdForm: FormGroup;
  user              : User;

  @ViewChild('form') form: ElementRef;
  disabled: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private _sncakbar: Snackbar
    ) { }

  ngOnInit(): void {
    this.initForm();
    this.getEmailUser();
    this.disabled = true;
  }


  initForm() {
    this.changePassowrdForm = this.formBuilder.group({
      email: [{value: '', disabled: true}],
      currentPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    }, { validator: this.checkPassword });
  }


  getEmailUser() {
    this.user = JSON.parse(window.localStorage.getItem('elsfu') || '{}');    
    this.changePassowrdForm.patchValue({ email: this.user.email })
  }

  submit() {
    if (this.changePassowrdForm.valid) {
      this.profileService.updatePassword(this.changePassowrdForm.value).subscribe(
        res => {
          if (res) {
            this._sncakbar.addSnackbar(res?.message, res?.err, 3000);
          }
        }
      )
    }
  }

  checkPassword(control: AbstractControl):  ValidationErrors | null {
    const password        = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;    
    return password === confirmPassword ? null : { notSame: true }
  }
}
