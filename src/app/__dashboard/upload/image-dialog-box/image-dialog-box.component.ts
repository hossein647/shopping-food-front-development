import { Component, ElementRef, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { Upload } from '../state/upload/upload.model';

@Component({
  selector: 'app-image-dialog-box',
  templateUrl: './image-dialog-box.component.html',
  styleUrls: ['./image-dialog-box.component.scss']
})
export class ImageDialogBoxComponent implements OnInit {

  responseMessage  : string;
  images           : Upload[] = [];
  urlImages        : string[] = [];
  name             : string;
  imageNameSelected: string = '';
  baseApi: string = environment.url;

  @ViewChildren('img') imgElement: QueryList<ElementRef>;
  
  constructor(
    private matDialogRef: MatDialogRef<ImageDialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
    ) {       
    this.images = data.images || [];
    this.imageNameSelected = data.selected;
    this.responseMessage = data.responseImage;
  }

  ngOnInit(): void {
  }

  selected(event: any, image: Upload) {
    
    this.imageNameSelected = image.filename
  }


  save(){
    const image = this.images.find(image => image.filename === this.imageNameSelected);    
    if (this.imageNameSelected.length > 0) this.matDialogRef.close(image);
  }


  close() {
    this.matDialogRef.close();
  }

}
