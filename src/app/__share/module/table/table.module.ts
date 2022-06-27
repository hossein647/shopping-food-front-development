import { CdkTableModule } from '@angular/cdk/table';
import { NgModule } from '@angular/core';
import { TableComponent } from './table.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [
    TableComponent
  ],
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatTableModule,
    CdkTableModule
  ],
  exports: [TableComponent]
})
export class TableModule { }
