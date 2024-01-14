import { Component, OnInit } from '@angular/core';
import { Snackbar } from 'src/app/___share/helper/snackbar';
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
  uploadCenter: string = '';
  urlImage: string = '';

  constructor(
    private uploadService: UploadService,
    private _snackbar: Snackbar,
  ) { 
    this.uploadService.uploadCenter$.subscribe({
      next: (res: any) => {
        if (res?.setting?.uploadCenter) {
          this.uploadCenter = res.setting.uploadCenter;
          this.getUploadedDataForImage();
        }
      },
      error: (err: any) => {}
    })
  }

  ngOnInit(): void {
  }


  getUploadedDataForImage() {
    this.uploadService.getAllGallery(this.uploadCenter).subscribe((res: any) => {
      if ((res)) {          
        this.files = [];
        const result = JSON.parse(JSON.stringify(res));
        this.files = result.files?.map((file: any) => ({ ...file, id: file?.['_id']  }));
      }
    })
  }



  remove(i: number, id: string) {    
    this.uploadService.remove(id, this.uploadCenter, this.files[i].fileLiara?.Key).subscribe(res => {
      if (res) {   
        this.getUploadedDataForImage();
        const result = JSON.parse(JSON.stringify(res));
        this._snackbar.addSnackbar(result.message, result?.err, 3000);
      }
    })
  }
}
