import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  @Input() successMessage!: string;
  constructor(private _snackbar : MatSnackBar) { }

  ngOnInit(): void {
    this._snackbar.open(this.successMessage, '', { 
      duration: 2000,
      panelClass: 'snackbar-color',
      horizontalPosition:'end',
      verticalPosition: 'bottom'
    });
  }

}
