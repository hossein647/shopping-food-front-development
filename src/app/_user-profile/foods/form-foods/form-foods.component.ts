import { SubFood } from './../../sub-category-food/state/sub-food.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SuperFood } from 'src/app/__share/enum/super-food.enum';
import { FoodCategory } from '../../food-category/state/food-category.model';
import { Food } from '../state/food.model';
import { Shop } from '../../shops/state/shop/shop.model';
import { MatDialogHelper } from 'src/app/__share/helper/mat-dialog-helper';
import { UploadService } from '../../upload/state/upload/upload.service';
import { SubFoodService } from '../../sub-category-food/state/sub-food.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodQuery } from '../state/food.query';
import { FoodService } from '../state/food.service';
import { Snackbar } from 'src/app/__share/helper/snackbar';
import { Location } from '@angular/common';
import { ShopsService } from '../../shops/state/shop/shops.service';
import { FoodCategoryService } from '../../food-category/state/food-category.service';
import { Upload } from '../../upload/state/upload/upload.model';

@Component({
  selector: 'app-form-foods',
  templateUrl: './form-foods.component.html',
  styleUrls: ['./form-foods.component.scss']
})
export class FormFoodsComponent implements OnInit {
  
  title                    : string;
  shops                    : Shop[] = [];
  subFoodCategories        : SubFood[] = [];
  food                     : Food;
  submitLabel              : string;
  state                    : SuperFood;
  checked                  : boolean;
  buttonGroup              : any[];
  stepFirstFood            : FormGroup;
  stepSecondFood           : FormGroup;
  descriptionEmpty         : string;
  categoryEmpty            : string;
  imageEmpty               : string;
  priceEmpty               : string;
  nameEmpty                : string;
  shopEmpty                : string;
  images                   : Upload[];
  responseMessage          : string;
  foodId                   : number;
  foodCategories           : FoodCategory[] = [];
  loadingSpinner           : boolean = false;
  selectedImage: string;

  constructor(
    private formBuilder: FormBuilder,
    private dialogHelper: MatDialogHelper,
    private uploadService: UploadService,
    private subFoodService: SubFoodService,
    private activatedRoute: ActivatedRoute,
    private foodQuery: FoodQuery,
    private router: Router,
    private foodService: FoodService,
    private _snackbar: Snackbar,
    private location: Location,
    private shopService: ShopsService,
    private foodCategoryService: FoodCategoryService,
  ) {}



  ngOnInit(): void {
    this.initForm();
    this.initError();  
    this.initLabels() ;
    this.getShops();
    this.changeStepFirstFood();
    this.superFoodState();
    this.isCreateForm();
    if (!this.isCreateForm()) this.getEditFormFood(); 
  }
  superFoodState() {
    this.buttonGroup = [
      { label: 'انتظار', class: 'wait', value: SuperFood.Wait },
      { label: 'تایید', class: 'confirm', value: SuperFood.Confirm },
      { label: 'رد', class: 'reject', value: SuperFood.Reject },
      { label: 'نمایش', class: 'show', value: SuperFood.Show },
      { label: 'تکمیل', class: 'complete', value: SuperFood.Complete },
    ]
  }


  isCreateForm(): boolean {
    return this.router.url.endsWith('create') ? true : false;
  }

  submit() {    
    const formValue: Food = { 
      ...this.stepFirstFood.value, 
      ...this.stepSecondFood.value, 
      imageId: this.food.imageId,
      super: this.checked,
      state: this.state
    };
        
    if (this.validForm()) {
      if(this.isCreateForm()) this.submitCreateForm(formValue)
      else this.submitEditForm(formValue)
    }
  }


  submitCreateForm(food: Food) {
    this.foodService.create(food).subscribe(res => {
      if (res) {
        const result = JSON.parse(JSON.stringify(res));
        this._snackbar.addSnackbar(result.message, result?.err, 3000);
        if (!result?.err) {
          this.location.back();
        }
      }
    });
  }

  submitEditForm(food: Food) {
    this.foodService.update(this.foodId, food).subscribe(res => {
      const result = JSON.parse(JSON.stringify(res))
      this._snackbar.addSnackbar(result.message, result?.err, 3000);
      if (!result?.err) this.location.back();
    });
  }



  initForm() {
    this.stepFirstFood = this.formBuilder.group({
      name       : ['', Validators.required],
      description: ['', Validators.required],
      category   : ['', Validators.required],
      shop       : ['', Validators.required],
      subFood    : ['', Validators.required],
      price      : ['', Validators.required],
      copon      : [''],
    })
    
    this.stepSecondFood = this.formBuilder.group({
      image      : ['', Validators.required],
      super      : [false],
      state      : [''],
    })
  }

  

  initError() {
    this.nameEmpty = 'نام نمی تواند خالی باشد';
    this.descriptionEmpty = 'توضیحات نمی تواند خالی باشد';
    this.categoryEmpty = 'دسته بندی باید انتخاب کنید';
    this.shopEmpty = 'رستوران باید انتخاب کنید';
    this.priceEmpty = 'قیمت نمی تواند خالی باشد';
    this.imageEmpty = 'یک تصویر باید انتخاب کنید';
  }

  openDialog() {
    this.loadingSpinner = true;
    this.uploadService.getAllPrivate().subscribe(res => { 
      if (res) {
        this.loadingSpinner = false;
        const result = JSON.parse(JSON.stringify(res));
        this.images = result.files;
        this.responseMessage = result.responseImage;
        this.selectedImage = this.stepSecondFood.value.image;

        const dialogRef = this.dialogHelper.openDialog(this.images, this.responseMessage, this.selectedImage);
        dialogRef.afterClosed().subscribe(image => {
          if (image) {          
            this.food = { ...this.food, image: image.filename, imageId: image._id };          
            this.stepSecondFood.patchValue({ image: this.food.image });
          }
        })
      }
    })
  }

  getSubFoodCategories(name: string) {
    this.subFoodService.filterShop(name).subscribe(
      res => {
        if (res) {
          this.subFoodCategories = [];
          res.subFood?.forEach((subFood: SubFood) => {
            if (subFood.shop === name) {
              this.subFoodCategories.push(subFood)
            }
          })
        }
      }
    )
  }


  getEditFormFood() {
    this.activatedRoute.params.subscribe(param => {      
      this.foodId = param.id
      this.foodQuery.select(state => state.entities?.foods).subscribe(entityFood => {        
        if (entityFood) {
          const result = JSON.parse(JSON.stringify(entityFood));          
          if (result.docs?.length !== 0) {
            const foods: Food[] = Array.from(result.docs);
            this.food = foods.filter(food => food._id === this.foodId)[0];
            
            this.selectedImage = this.food?.image;
            this.stepFirstFood.patchValue(this.food);
            this.stepSecondFood.patchValue(this.food);            
            this.checked = this.food.super;          
          }
        } else {
          this.router.navigate(['/dashboard/foods']);
        }
      })
    });
  }


  getShops() {
    this.shopService.getAllPrivate().subscribe(
      res => {
        if (res) {
          this.shops = res.shops;
          this.shops.forEach(shop => {            
            if (shop.name === this.stepFirstFood.value.shop) this.getFoodCategory(shop.category)
          })       
        }
      }
    )
  }


  getFoodCategory(name: string) {
    this.foodCategoryService.filterShopCategory(name).subscribe(
      res => {
        if (res) this.foodCategories = res.foodCategories;          
      }
    )
  }


  changeStepFirstFood() {
    this.stepFirstFood?.valueChanges?.subscribe(
      food => {        
        this.shops?.forEach(shop => {          
          if (shop.name === food.shop) this.getFoodCategory(shop.category);
        });
        this.getSubFoodCategories(food.shop);
      }
    )
  }
  
  
  changeStepSecondFood() {
    this.stepFirstFood?.valueChanges?.subscribe(
      food => {        
        this.shops?.forEach(shop => {          
          if (shop.name === food.shop) this.getFoodCategory(shop.category);
        });
        this.getSubFoodCategories(food.shop);
      }
    )
  }


  validForm(): boolean {   
    return this.stepFirstFood?.valid && this.stepSecondFood?.valid;
  }


  slideToggleChange(event: MatSlideToggleChange) {
    this.checked = event.source.checked;
    this.state = this.checked ? SuperFood.Wait : SuperFood.Off;    
  }


  initLabels() {    
    if (this.isCreateForm()) {
      this.title = 'ساخت غذا';
      this.submitLabel = 'ایجاد';
    } else {
      this.title = 'ویرایش غذا';
     this.submitLabel = 'آپدیت';
    }
  }

}
