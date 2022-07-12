import { SubFoodService } from './../state/sub-food.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Snackbar } from 'src/app/___share/helper/snackbar';
import { Location } from '@angular/common';
import { Shop } from '../../shops/state/shop/shop.model';
import { ShopsService } from '../../shops/state/shop/shops.service';

@Component({
  selector: 'app-sub-food',
  templateUrl: './sub-food.component.html',
  styleUrls: ['./sub-food.component.scss']
})
export class SubFoodComponent implements OnInit {


  @ViewChild('form') form : NgForm;
  subFoodCategory         : FormGroup;
  submitLabel             : string;
  title                   : string;
  subFoodId               : number;
  shops                   : Shop[];
  nameError               : string;
  shopError               : string;


  constructor(
    private formBuilder: FormBuilder,
    private router     : Router,
    private activatedRoute: ActivatedRoute,
    private subFoodService: SubFoodService,
    private _snackbar: Snackbar,
    private location: Location,
    private shopService: ShopsService,
  ) { }

  ngOnInit(): void {
    
    this.nameError = 'فیلد نام نمی تواند خالی باشد.';
    this.shopError = 'فیلد رستوران نمی تواند خالی باشد.';

    this.initBothForm();
    this.activatedRoute.params.subscribe(param => this.subFoodId = param.id);
    if (!this.isCreateForm()) this.getDateFormEdit();
    this.getShopsForUser();
    
    
  }
  
  
  initBothForm() {
    this.subFoodCategory = this.formBuilder.group({
      name: [null, Validators.required],
      shop: [null, Validators.required],
    });  
  }

  submit(subFoodCategory: FormGroup) {
    this.isCreateForm() ? this.create(subFoodCategory) : this.update(subFoodCategory);
  }


  isCreateForm(): boolean {
    const create = this.router.url.includes('create');
    this.submitLabel =  create ? 'ایجاد' :       'آپدیت';
    this.title       =  create ? 'ساخت زیردسته غذا' : 'ویرایش زیردسته غذا';    
    return create;
  }


  getDateFormEdit() {
    this.subFoodService.get(this.subFoodId).subscribe(
      res => {
        if (res) {       
          this.subFoodCategory.patchValue(res.subFood);
        }
      }
    )
  }

  create(subFoodCategory: FormGroup) {
    this.subFoodService.create(subFoodCategory.value).subscribe(
      res => {
        if (res) {
          this._snackbar.addSnackbar(res.message, res?.err, 3000);
          if (!res.err) this.location.back();
        }
      }
    )
  }

  update(subFoodCategory: FormGroup) {
    this.subFoodService.update(this.subFoodId, subFoodCategory.value).subscribe(
      res => {
        if (res) {
          this._snackbar.addSnackbar(res.message, res?.err, 3000);
          if (!res.err) this.location.back();
        }
      }
    )
  }


  getShopsForUser() {
    this.shopService.getAllPrivate().subscribe(
      res => {
        if (res) {
          this.shops = res.shops;
        }
      }
    )
  }

}
