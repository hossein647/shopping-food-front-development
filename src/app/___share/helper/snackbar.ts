import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";


@Injectable({ providedIn: 'root' })
export class Snackbar {
    constructor(
        private _snackbar: MatSnackBar
    ) {}
    
    addSnackbar(message: string, error: boolean, time: number) {
        this._snackbar.open(message, '', {
            duration: time,
            panelClass: error ? 'snackbar-color-error' : 'snackbar-color-success',
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
        });
    }
}