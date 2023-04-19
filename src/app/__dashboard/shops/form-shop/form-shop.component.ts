import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogHelper } from 'src/app/___share/helper/mat-dialog-helper';
import { Snackbar } from 'src/app/___share/helper/snackbar';
import { Category } from '../../categories/state/category.model';
import { CategoryService } from '../../categories/state/category.service';
import { UploadService } from '../../upload/state/upload/upload.service';
import { ShopPaginateQuery } from '../state/shop-paginate/shop-paginate.query';
import { Shop } from '../state/shop/shop.model';
import { ShopsService } from '../state/shop/shops.service';


@Component({
  selector: 'app-form-shop',
  templateUrl: './form-shop.component.html',
  styleUrls: ['./form-shop.component.scss']
})
export class FormShopComponent implements OnInit {

  shopForm        : FormGroup;
  nameEmpty       : string;
  descriptionEmpty: string;
  addressEmpty    : string;
  phoneEmpty      : string;
  phoneMustNumber : string;
  categoryEmpty   : string;
  imageEmpty      : string;
  title           : string;
  shopEdit        : Shop;
  submitLabel     : string;
  typePhone       : boolean;
  categories      : Category[] = [];
  imageInit       : string;
  shopId          : number;
  loadingSpinner  : boolean = false;
  selectedImage   : string;
  
  
  @ViewChild('form') form: NgForm;
  @ViewChild('chipList') chipList: MatChipList;
  
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private shopPaginateQuery: ShopPaginateQuery,
    private shopService: ShopsService,
    private _snackbar: Snackbar,
    private router: Router,
    private uploadService: UploadService,
    private dialogHelper: MatDialogHelper,
    private location: Location,
    private categoryService: CategoryService,
    ) {}

     
  ngOnInit(): void {
    this.initValueForm();
    this.initErrorForm();
    this.initLabel();
    this.getCategoryState();
    if (!this.isCreateForm()) this.getShopEditFrom();
  }


  isCreateForm(): boolean {
    return this.router.url.endsWith('create');
  }


  initValueForm() {    
    this.shopForm = this.formBuilder.group({
      name       : [ '', Validators.required],
      description: this.formBuilder.array([], this.validateArrayNotEmpty),
      category   : [ '', Validators.required],
      address    : [ '', Validators.required],
      phone      : [ null, [Validators.required, Validators.pattern("^[0-9]*$")]],
      image      : [ '', Validators.required],
    })
  }


  onSubmit() {
    const formValue = { ...this.shopForm.value, imageId: this.shopEdit.imageId }
    if (this.isCreateForm()) this.submitCreateForm(formValue)
    else this.submitEditForm(formValue);
  }

  changePhone(e: any) {  
    if (Number.isInteger(Number(e.target.value)) === true && e.target.value?.length !== 0) {
      this.typePhone = true;
    } else {
      this.typePhone = false;
    }    
  }


  submitCreateForm(shop: Shop) {
    if (this.shopForm.valid) {
      this.shopService.create(shop).subscribe(res => {
        if (res) {
          const result = JSON.parse(JSON.stringify(res))
          this._snackbar.addSnackbar(result.message, result?.err, 3000);
          if (!result?.err) {
            this.form.resetForm();
            this.location.back();
          }
        }
      });
    }
  }

  submitEditForm(shop: Shop) {
    if (this.shopForm.valid) {
      this.shopService.update(this.shopId, shop).subscribe(res => {
        const result = JSON.parse(JSON.stringify(res));
        this._snackbar.addSnackbar(result.message, result?.err, 3000);
        if (!result?.err) this.location.back();
      })
    }
  }

  initErrorForm() {
    this.nameEmpty = "نام باید مقدار داشته باشد";
    this.descriptionEmpty = 'توضیحات باید مقدار داشته باشد';
    this.categoryEmpty = 'دسته بندی باید انتخاب کنید';
    this.addressEmpty = 'آدرس باید مقدار داشته باشد';
    this.phoneEmpty = 'تلفن باید مقدار داشته باشد';
    this.phoneMustNumber = 'فقط اعداد پشتیبانی می شوند';
    this.imageEmpty = 'باید یک تصویر انتخاب کنید';
  }

  initLabel() {
    if (this.isCreateForm()) {
      this.submitLabel = 'ایجاد';
      this.title = "ایجاد رستوران";
      this.imageInit = 'انتخاب تصویر';
    } else {
      this.title = 'ویرایش رستوران';
      this.submitLabel = 'آپدیت';
    }
  }
  
  openDialog() {
    this.loadingSpinner = true;
    this.uploadService.getAllPrivate().subscribe(res => {
      if (res) {
        this.loadingSpinner = false;
        const result = JSON.parse(JSON.stringify(res))
        const images = result.files;
        const responseImage = result.responseImage;
        this.selectedImage = this.shopForm.value.image;
        
        const dialogRef = this.dialogHelper.openDialog(images, responseImage, this.selectedImage);
        dialogRef.afterClosed().subscribe(image => {
          if (image) {
            this.shopEdit = {
              ...this.shopEdit, image: image.filename, imageId: image._id
            }
            this.shopForm.patchValue(this.shopEdit)
          };
        })
      }
    })
  }


  addTagFromInput(chipInput: MatChipInputEvent) {
    const value = chipInput.value;
    const chips = (<FormArray>this.shopForm.get('description'));
    if (value.trim() && chips.length <= 2) this.newChip(value);
    chipInput.chipInput!.clear();
    if (chips.length > 0) this.chipList.errorState = false;
  }


  removeTag(shopForm: FormGroup, i: number) {
    (<FormArray>shopForm.get('description')).removeAt(i);
    if ((<FormArray>shopForm.get('description')).length === 0) this.chipList.errorState = true;
  }


  getShopEditFrom() {
    this.activatedRoute.params.subscribe(param => {
      this.shopId = param.id;
      this.shopPaginateQuery.select(state => state.entities?.shops).subscribe(data => {
        if (data) {
          const shops: Shop[] = JSON.parse(JSON.stringify(data))?.docs;
          this.shopEdit       = shops?.filter(shop => shop._id === this.shopId)[0];

          if (this.shopEdit) {
            this.shopForm.patchValue({ ...this.shopEdit })
            this.selectedImage        = this.shopEdit.image;
            this.shopEdit.description.forEach(desc => this.newChip(desc))
          }
        } else {
          this.router.navigate(['/dashboard/shops'])
        }
      })
    })
  }


  validateArrayNotEmpty(c: AbstractControl) {
    if (c.value && c.value.length === 0) return { required: true }
    return null;
  }
  

  getCategoryState() {
    this.categoryService.getAll().subscribe(
      res => {
        if (res) {
          const result = JSON.parse(JSON.stringify(res));
          this.categories = result.shopCategories
        }
      }
    );
  }



  get formShop() {    
    return this.shopForm.get('description') as FormArray;
  }


  onInputFocus(chipList: MatChipList) {
    const chipsControle = (<FormArray>this.shopForm.get('description'));
    if (chipsControle.length === 0) chipList.errorState = true;
  }


  newChip(desc: string) {
    const controls   = <FormArray>this.shopForm.get('description');
    const newControl = this.formBuilder.control(desc.trim());
    controls.push(newControl)
  }
}
