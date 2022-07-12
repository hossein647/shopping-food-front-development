import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Form } from 'src/app/___share/interface/form.interface';

@Component({
  selector: 'app-sign-form',
  templateUrl: './sign-form.component.html',
  styleUrls: ['./sign-form.component.scss']
})
export class SignFormComponent implements OnInit {

  userForm: FormGroup;
  emailError: string;
  passwordError: string;

  @Input() title         : string;
  @Input() submitLabel   : string;
  @Input() emailInit     : string;
  @Input() passwordInit  : string;
  @Input() loadingSpinner: boolean;
  @Input() show          : boolean;

  @ViewChild('form') form!: NgForm;
  @Output() onSubmit = new EventEmitter<Form>();

  constructor(
    private formBuilder: FormBuilder,
    ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.initError();
  }


  submit() {
    this.onSubmit.emit({formGroup: this.userForm, ngForm: this.form});
  }


  initializeForm() {
    this.userForm = this.formBuilder.group({
      email: [this.emailInit, [Validators.required, Validators.email]],
      password: [this.passwordInit, [Validators.required, Validators.minLength(8)]]
    })
  }

  initError() {
    this.emailError = 'ایمیل وارد نشده است.';
    this.passwordError = 'پسورد وارد نشده است یا کمتر از 8 رقم است.';
  }
}
