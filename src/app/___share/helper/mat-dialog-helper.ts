import { Injectable } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Observable, Subject } from "rxjs";
import { ImageDialogBoxComponent } from "src/app/__dashboard/upload/image-dialog-box/image-dialog-box.component";
import { Upload } from "src/app/__dashboard/upload/state/upload/upload.model";

@Injectable({
    providedIn: 'root'
})
export class MatDialogHelper {

    constructor(
        private dialog: MatDialog,
    ) {}


    openDialog(images: Upload[], responseImage: string, selectedImage: string) {
        const config: MatDialogConfig = {
            width: '701px',
            height: '500px',
            disableClose: true,
            direction: 'rtl',
            data: {
                images: images,
                selected: selectedImage,
                responseImage: responseImage,
            }
        }
        const dialogRef = this.dialog.open(ImageDialogBoxComponent, config);     
        return dialogRef;
    }
}
