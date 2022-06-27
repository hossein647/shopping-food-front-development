import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Snackbar } from 'src/app/__share/helper/snackbar';
import { Category } from '../../categories/state/category.model';
import { CategoryService } from '../../categories/state/category.service';
import { FoodCategory } from '../state/food-category.model';
import { FoodCategoryService } from '../state/food-category.service';

@Component({
  selector: 'app-food-category-form',
  templateUrl: './food-category-form.component.html',
  styleUrls: ['./food-category-form.component.scss']
})
export class FoodCategoryFormComponent implements OnInit {

  formFoodCategory!: FormGroup;
  
  shopCategories!: Category[];
  title!: string;
  submitLabel!: string;
  nameError!: string;
  shopCategoryError!: string;
  
  @ViewChild('form') form!: NgForm;
  foodCategoryId: number;
  
  constructor(
    private formBuilder: FormBuilder,
    private foodCategoryService: FoodCategoryService,
    private shopCategoryService: CategoryService,
    private activatedRoute: ActivatedRoute,
    private _snackbar: Snackbar,
    private location: Location,
    private router: Router,
    private foodCategroyService: FoodCategoryService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.initLabel();
    this.initError();
    this.getShopCategories();
    if (!this.isCreateForm()) this.getEditForm();

  }


  isCreateForm() : boolean {
    return this.router.url.endsWith('create');
  }


  initError() {
    this.nameError = 'فیلد نام نمی تواند خالی باشد.';
    this.shopCategoryError = 'یک دسته بندی انتخاب کنید.';
  }


  initLabel() {
    if (this.isCreateForm()) {
      this.title = 'ساخت دسته بندی غذا';
      this.submitLabel = 'ایجاد';
    } else {
      this.title = 'ویرایش دسته بندی غذا';
      this.submitLabel = 'آپدیت';
    }
  }


  submit() {
    if (this.isCreateForm()) this.submitCreateForm();
    else this.submitEditForm();
  }


  submitCreateForm() {
    if (this.formFoodCategory.valid) {
      this.foodCategroyService.create(this.formFoodCategory.value).subscribe(
        res => {
          if (res) {
            const result = JSON.parse(JSON.stringify(res));
            this._snackbar.addSnackbar(result.message, result?.err, 3000);
            if (!result.err) {
              this.form.resetForm();
              this.location.back();
            }
          }
      });
    }
  }
  
  
  submitEditForm() {
    if (this.formFoodCategory.valid) {
      this.foodCategoryService.update(this.foodCategoryId, this.formFoodCategory.value).subscribe(
        res => {
          if (res) {
            const result = JSON.parse(JSON.stringify(res));
            this._snackbar.addSnackbar(result.message, result.err, 3000);
            if (!result?.err) this.location.back();
          }
      })
    }
  }


  initForm() {
    this.formFoodCategory = this.formBuilder.group({
      shopCategory: ['', Validators.required],
      name        : ['', Validators.required]
    })
  }


  getEditForm() {
    this.activatedRoute.params.subscribe(param => {
      this.foodCategoryId = param.id;
      this.getFoodCategory();
    })
  }


  getFoodCategory() {
    this.foodCategoryService.getAll().subscribe(res => {
      if (res) {        
        const FoodCategories: FoodCategory[] = (JSON.parse(JSON.stringify(res))).foodCategories;
        const editFoodCategory = FoodCategories.filter(
          (foodCategory) => foodCategory._id === this.foodCategoryId
        );
        this.formFoodCategory.patchValue(editFoodCategory[0])
      }
    })
  }


  getShopCategories() {
    this.shopCategoryService.getAll().subscribe(res => {
      if (res) {        
        this.shopCategories = (JSON.parse(JSON.stringify(res))).shopCategories;
      }
    })
  }

}
