import { CheckboxChange } from './../../../__dashboard/_share/interface/checkboxChange.interface';
import { Component, Input, ViewChild, Output, EventEmitter, QueryList, ElementRef, Renderer2, ViewChildren } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { ColumnName } from './../../interface/column-name.interface';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChildren('th') th               : QueryList<ElementRef>;
  @ViewChild('paginator') paginatorElement: ElementRef;

  @Input() displayedColumns: string[];
  @Input() dataSource      : any;
  @Input() selection       : any;
  @Input() customColumnName: ColumnName[];
  @Input() length          : number;
  @Input() pageIndex       : number;
  @Input() pageSize        : number;
  @Input() pageSizeOptions : number[];

  @Output() onChangePaginateValue = new EventEmitter<{pageSize: number, pageIndex: number}>();
  @Output() changeEventCheckbox   = new EventEmitter<CheckboxChange>();

  constructor(
    private renderer: Renderer2,
    private elRef   : ElementRef
  ) {}

  ngAfterViewInit() {    
    this.paginator._intl.itemsPerPageLabel = "آیتم در صفحه";
    this.paginator._intl.firstPageLabel = "صفحه اول";
    this.paginator._intl.lastPageLabel = "صفحه آخر";
    this.paginator._intl.nextPageLabel = "صفحه بعدی";
    this.paginator._intl.previousPageLabel = "صفحه قبلی";

    this.setFixWidthHeaderTable();
    // const tableWidth = this.elRef.nativeElement.querySelector('table').getBoundingClientRect();
    // const matPaginator = this.elRef.nativeElement.querySelector('mat-paginator').getBoundingClientRect();
    // console.log(tableWidth);
    // console.log(matPaginator);
    // console.log(window.innerWidth);
    // const paginatorWidth = tableWidth.width / window.innerWidth;
    // console.log(paginatorWidth);
    
    // this.renderer.setStyle(matPaginator, 'width', `${paginatorWidth}vw`)
  }


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const countRows = this.dataSource?.length;            
    return numSelected === countRows;
  }

  masterToggle() {    
    if (this.isAllSelected()) return this.selection.clear();    
    this.selection.select(...this.dataSource.data);    
  }

  checkboxLabel(row?: any): string {
    if (!row) return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  onPaginateChanges(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.length = event.length;
    this.onChangePaginateValue.emit({pageSize: this.pageSize, pageIndex: this.pageIndex})
  }

  checkboxChanges(event: MatCheckboxChange, rowIndex: number) {    
    this.changeEventCheckbox.emit({event, rowIndex})
  }


  findColumnValue = (element: unknown, column: ColumnName): string => eval(`element.${column.key}`)
  
  // rowOnClcik(selection: SelectionModel<any>, row: any, index: number) {
    
  //   const selectedRow = Object.entries(selection);
  //   selectedRow[2][1].forEach((element: any) => {
  //   });
    
  // }



  setFixWidthHeaderTable() {
    this.th?.forEach(th => {
      this.renderer.setStyle(th.nativeElement, 'width', `calc(100% / ${this.displayedColumns.length})`)
    })
  }

}
