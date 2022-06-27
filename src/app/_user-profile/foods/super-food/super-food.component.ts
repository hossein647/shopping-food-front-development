import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Snackbar } from 'src/app/__share/helper/snackbar';
import { ColumnName } from 'src/app/__share/interface/column-name.interface';
import { Food } from '../state/food.model';
import { FoodQuery } from '../state/food.query';
import { FoodService } from '../state/food.service';
import { CheckboxChange } from '../../_share/interface/checkboxChange.interface';

@Component({
  selector: 'app-super-food',
  templateUrl: './super-food.component.html',
  styleUrls: ['./super-food.component.scss']
})
export class SuperFoodComponent implements OnInit {

  columnName: ColumnName[];
  displayedColumns: string[];
  pageSizeOptions: number[];
  checked: boolean;
  totalDocs: number;
  pageIndex: number;
  limit: number;
  idFood: number;
  selection: any;
  dataSource: any;
  noData: string;

  constructor(
    private foodService: FoodService,
    private foodQuery: FoodQuery,
    private _snackbar: Snackbar,
  ) { }

  ngOnInit(): void {
    this.initDefaultValueTable();
    this.getDataSourceWithPageinate();
  }

  reject() {    
    this.foodService.reject(this.idFood).subscribe(res => {
      if (res) {
        const result = JSON.parse(JSON.stringify(res));

        this.noData = result.message;
        if (result.status === 403) this.noData = result.error?.message;
        
        this._snackbar.addSnackbar(result.message, false, 3000);
        this.foodService.paginateSuperFoods(this.limit, this.pageIndex).subscribe();
        this.checked = false;
      }
    })
  }

  confirm() {
    this.foodService.confirm(this.idFood).subscribe(res => {
      if (res) {        
        const result = JSON.parse(JSON.stringify(res));
        this._snackbar.addSnackbar(result.message, result.err, 3000);
        this.foodService.paginateSuperFoods(this.limit, this.pageIndex).subscribe();
        this.checked = false;
      }
    })
  }

  changePaginateValue(e: any) {
    this.limit = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.foodService.paginateSuperFoods(this.limit, this.pageIndex).subscribe();
  }

  changeEventCheckbox(checkboxChange: CheckboxChange) {
    this.checked = checkboxChange.event.checked;
    const rowIndex = checkboxChange.rowIndex;
    this.idFood = this.dataSource.data?.[rowIndex]._id;
  }

  // init default create table
  initDefaultValueTable() {
    this.selection = new SelectionModel<Food>(false, []);
    this.displayedColumns = [
                              'select', 
                              'name', 
                              'description', 
                              'category', 
                              'price', 
                              'super', 
                              'state',
                              'reserved.local'
                            ];
    this.columnName = [
      { key: 'name', header: 'نام' },
      { key: 'description', header: 'توضیحات' },
      { key: 'category', header: 'دسته بندی' },
      { key: 'price', header: 'قیمت' },
      { key: 'super', header: 'غذای ویژه' },
      { key: 'state', header: 'وضعیت غذای ویژه' },
      { key: 'reserved.local', header: 'رزرو' },
    ];
  }

  getDataSourceWithPageinate() {
    this.foodService.paginateSuperFoods(this.limit = 5, this.pageIndex = 0).subscribe();
    this.foodQuery.select(state => state.entities).subscribe(res => {
      if (res) {                
        const result = JSON.parse(JSON.stringify(res));
        const foods = result.foods?.docs;
        this.totalDocs = result.foods?.totalDocs;
        
        this.noData = result.message;
        if (result.status === 403) this.noData = result.error?.message;

        this.dataSource = new MatTableDataSource<Food>(foods);
        this.pageSizeOptions = [5, 10, 15, 20, 30, 40, 50];
      }
    })
  }


  reset() {
    this.foodService.reset(this.idFood).subscribe(res => {
      const result = JSON.parse(JSON.stringify(res));
      if (res) {
        this._snackbar.addSnackbar(result.message, result.err, 3000);
        this.foodService.paginateSuperFoods(this.limit, this.pageIndex).subscribe();
        this.checked = false;
      }      
    })
  }

}
