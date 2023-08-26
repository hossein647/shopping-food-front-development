import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogHelper } from 'src/app/___share/helper/mat-dialog-helper';
import { Snackbar } from 'src/app/___share/helper/snackbar';
import { UploadService } from '../../upload/state/upload/upload.service';
import { Category } from '../state/category.model';
import { CategoryService } from '../state/category.service';
import { CategoryPaginatorQuery } from '../state/state/category-paginator.query';

@Component({
  selector: 'app-shop-category',
  templateUrl: './shop-category.component.html',
  styleUrls: ['./shop-category.component.scss']
})
export class ShopCategoryComponent implements OnInit {

  formCategory: FormGroup;
  submitLabel: string;
  title: string;
  nameError: string;
  aliasError: string;
  imageEmpty: string;
  idCategory: number;
  selectedImage: string;

  @ViewChild('form') form: NgForm;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private categoryPaginatorQuery: CategoryPaginatorQuery,
    private activatedRout: ActivatedRoute,
    private _snackbar: Snackbar,
    private location: Location,
    private dialogHelper: MatDialogHelper,
    private uploadService: UploadService,
    private router: Router,
    private categroyService: CategoryService,
    ) { }

  ngOnInit(): void {
    this.initForm();
    this.initLabel();
    this.initError();
    if (!this.isCreateForm()) this.getEditFormDate();
  }


  isCreateForm(): boolean {
    return this.router.url.endsWith('create');
  }

  submit() {    
    if (this.isCreateForm()) this.submitCreateForm(this.formCategory.value);
    else this.submintEditForm(this.formCategory.value);
  }
  

  submitCreateForm(shopCategory: Category) {
    if (this.formCategory.valid) {
      this.categroyService.create(shopCategory).subscribe(res => {
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
  

  submintEditForm(shopCategory: Category) {
    if (this.formCategory.valid) {
      this.categoryService.update(this.idCategory, shopCategory).subscribe(res => {
        if (res) {
          const result = JSON.parse(JSON.stringify(res));
          this._snackbar.addSnackbar(result.message, result.err, 3000);
          if (!result?.err) this.location.back();
        }
      })
    }
  }
  initForm() {
    this.formCategory = this.formBuilder.group({
      name: ['', Validators.required],
      alias: ['', Validators.required],
      image: ['', Validators.required],
    })
  }


  openDialog() {
    this.uploadService.getAllPrivate().subscribe(res => {
      if (res) {
        const result = JSON.parse(JSON.stringify(res));
        const images = result.files;
        const responseMessage = result.responseImage;
        this.selectedImage = this.formCategory.value.image;

        const dialogRef = this.dialogHelper.openDialog(images, responseMessage, this.selectedImage);
        dialogRef.afterClosed().subscribe(image => {
          if (image) {
            this.formCategory.patchValue({ image: image.filename, imageId: image._id})
          }
        })
      }
    })
  }


  getEditFormDate() {
    this.activatedRout.params.subscribe(param => {
      this.idCategory = param.id;
      this.categoryPaginatorQuery.select(state => state.entities).subscribe(query => {
        if (query) {
          const result = JSON.parse(JSON.stringify(query));
          if ((Object.keys(result).length > 0)) {
            const { docs } = result?.['shopCategories'];
            const categories: Category[] = Array.from(docs);
            const editCategory = categories.filter((category) => category._id === this.idCategory);
            this.selectedImage = editCategory[0].image;
            this.formCategory.patchValue(editCategory[0]);
          } else {
            this.categoryService.getAll().subscribe(res => {
              if (res) {
                const categories: Category[] = (JSON.parse(JSON.stringify(res))).shopCategories;
                const editCategory = categories.filter((category) => category._id === this.idCategory);
                this.selectedImage = editCategory[0].image;
                this.formCategory.patchValue(editCategory[0]);
              }
            })
          }
        }
      })
    })
  }


  initLabel() {
    if (this.isCreateForm()) {
      this.title = 'ساخت دسته بندی رستوران';
      this.submitLabel = 'ایجاد';
    } else {
      this.title = 'ویرایش دسته بندی رستوران';
      this.submitLabel = 'آپدیت';
    }
  }


  initError() {
    this.nameError  = 'فیلد نام نمی تواند خالی باشد.';
    this.aliasError = 'فیلد نام مستعار نمی تواند خالی باشد.';
    this.imageEmpty = 'فیلد انتخاب عکس نمی تواند خالی باشد.';
  }
}

