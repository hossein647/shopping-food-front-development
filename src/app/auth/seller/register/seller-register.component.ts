import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Snackbar } from 'src/app/__share/helper/snackbar';
import { Form } from 'src/app/__share/interface/form.interface';
import { Role, User } from '../../state/user.model';
import { UserService } from '../../state/user.service';

@Component({
  selector: 'app-seller-register',
  templateUrl: './seller-register.component.html',
  styleUrls: ['./seller-register.component.scss']
})
export class SellerRegisterComponent implements OnInit {

  title!: string;
  submitLabel!: string;
  loadingSpinner!: boolean;
  allowRequest: boolean = true;
  @Input() show: boolean;

  constructor(
    private userService: UserService,
    private _snackbar: Snackbar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.title = 'ثبت نام فروشندگان';
    this.submitLabel = 'ثبت نام';
  }

  registerSeller(data: Form) {
    if (this.allowRequest) {
      this.loadingSpinner = true;
      this.allowRequest = false;
      const formWithRole: User = {
        email: data.formGroup.value.email,
        password: data.formGroup.value.password,
        role: Role.Seller
      };      
      this.userService.register(formWithRole).subscribe(res => {
        if (res) {  
          console.log('seller register : ', res);
                  
          this.allowRequest = true;
          this.loadingSpinner = false;
          const result = JSON.parse(JSON.stringify(res));
          this._snackbar.addSnackbar(result.message, result?.err, 3000);
          this.router.navigate(['/login']);
          if (!result?.err) data.ngForm.resetForm();
        }
      })
    }
  }

}
