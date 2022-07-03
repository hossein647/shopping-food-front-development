import { Component, OnInit } from '@angular/core';
import { Snackbar } from 'src/app/__share/helper/snackbar';
import { environment } from 'src/environments/environment';
import { Upload } from '../state/upload/upload.model';
import { UploadService } from '../state/upload/upload.service';

@Component({
  selector: 'app-read-upload',
  templateUrl: './read-upload.component.html',
  styleUrls: ['./read-upload.component.scss']
})
export class ReadUploadComponent implements OnInit {

  files: Upload[] = [];
  responseMessage: string;
  nameImage: string;
  baseApi: string = environment.url;

  constructor(
    private uploadService: UploadService,
    private _snackbar: Snackbar,
  ) { }

  ngOnInit(): void {
    this.getUploadedDataForImage();
  }


  getUploadedDataForImage() {
    this.uploadService.getAllPrivate().subscribe(res => {
      if (res) {        
        this.files = [];
        const result = JSON.parse(JSON.stringify(res));
        this.files = result.files;    
      }
    })
  }



  remove(i: number, id: number) {
    this.uploadService.remove(id).subscribe(res => {
      if (res) {   
        this.getUploadedDataForImage();
        const result = JSON.parse(JSON.stringify(res));
        this._snackbar.addSnackbar(result.message, result?.err, 3000);
      }
    })
  }
}
