import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Snackbar } from 'src/app/___share/helper/snackbar';
import { UploadService } from '../state/upload/upload.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  
  uploadForm    : FormGroup;
  files         : any = [];
  images        : any[] = [];
  emptyImage    : string;
  loadingSpinner: boolean = false;
  shopEmpty     : string;
  user          : any;

  @ViewChild('inputFileSelect') input: ElementRef;

  constructor(
    private uploadService: UploadService,
    private _sncakbar: Snackbar,
    private location: Location,
    ) { }

  

    ngOnInit(): void {
      this.initForm();
      this.emptyImage = 'لطفا یک یا چند تصویر انتخاب کنید'
    }
  
  
  initForm() {
    this.user = JSON.parse(window.localStorage.getItem('elsfu') || '{}')
    this.uploadForm = new FormGroup({
      images: new FormControl(null, Validators.required),
    })
  }

  
  changeFileSelect(event: any) {
    this.files = [];
    this.images = [];
    this.files = Array.from(event.target.files);        
    for (let i = 0; i < this.files.length; i++) {
      const reader = new FileReader();
      reader.onload = (event) => {
        this.images.push({
          url: event.target?.result,
          name: this.files[i]?.['name']
        });
      }
      reader.readAsDataURL(this.files[i]);
    }    
  }
  
  upload() {   
    this.loadingSpinner = true; 
    this.limitSizeFile(this.files);

    if (this.files.length > 0 && this.uploadForm.valid && !this.limitSizeFile(this.files)) {      
      this.uploadService.uploadImage(this.files).subscribe(
        (res: any) => {
          if (res ) { 
            this.loadingSpinner = false;        
            this._sncakbar.addSnackbar(res.message, res?.err, 3000);
            if (!res?.err) {
              this.images.splice(0);
              this.files.splice(0)
              this.uploadForm.reset();
              this.location.back();
            }
          }
        },
        err => {          
          let message = '';
          this.loadingSpinner = false;
          message = err.error.message;
          if (err?.error?.statusCode === 403) message = err.error.message;
          if (err?.error?.error === 'Payload Too Large') message = "حجم تصویر بیش از اندازه است (حداکثر تا 1Mb)";
          if (err?.error?.message === 'Unauthorized') message = "اعتبار زمانی ورود به سایت شما تمام شده است، باید دوبار وارد سایت شوید.";
          this._sncakbar.addSnackbar(message, err?.error, 3000); 
        }
      )
    }
  }

  
  removePreviewFile(i: number, name: string) {
    const index = this.files.findIndex((file: any) => file.name === name)
    this.images.splice(i, 1);
    this.files.splice(index, 1);
    this.limitSizeFile(this.files);
    if (this.files.length === 0) this.uploadForm.reset();
    
  }


  get image() {
    return this.uploadForm.get('images');
  }


  limitSizeFile(files: any[]): boolean {
    const file = files.some(file => file.size / (1024 ** 2) >= 1)
    if (file) {
      this._sncakbar.addSnackbar('حجم تصویر بیش از اندازه است (حداکثر تا 1Mb)', true, 3000);
      this.loadingSpinner = false;
      return true;
    }
    return false;
  }
}