import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnName } from 'src/app/__share/interface/column-name.interface';
import { Food } from '../state/food.model';
import { FoodQuery } from '../state/food.query';
import { FoodService } from '../state/food.service';
import { CheckboxChange } from '../../_share/interface/checkboxChange.interface';
import { Snackbar } from 'src/app/__share/helper/snackbar';
import { CategoryService } from '../../categories/state/category.service';

@Component({
  selector: 'app-read-foods',
  templateUrl: './read-foods.component.html',
  styleUrls: ['./read-foods.component.scss']
})
export class ReadFoodsComponent implements OnInit {

  customColumnName      : ColumnName[];
  displayedColumns: string[];
  pageSizeOptions : number[];
  checked         : boolean;
  totalDocs       : number;
  pageIndex       : number;
  limit           : number;
  idFood          : number;
  selection       : any;
  dataSource      : any;
  noData          : string;
  
  constructor(
    private foodService    : FoodService,
    private foodQuery      : FoodQuery,
    private router         : Router,
    private activatedRoute : ActivatedRoute,
    private _snackbar      : Snackbar,
    private categoryService: CategoryService,
  ) { }

  ngOnInit(): void {
    this.foodService.paginateFoods(this.limit = 5, this.pageIndex = 0).subscribe();
    this.categoryService.getAll().subscribe(); // only for access state category for part edit food
    this.initDefaultValueTable();
    this.getDataSourceWithPageinate();
  }

  removeCategory() {
    this.foodService.remove(this.idFood).subscribe(res => {
      const result = JSON.parse(JSON.stringify(res));
      if (res) {
        this._snackbar.addSnackbar(result.message, result.err, 3000);
        this.foodService.paginateFoods(this.limit, this.pageIndex).subscribe(); // request for refresh data
        this.checked = false;
      }
    })
  }

  editCategory() {
    this.router.navigate(['edit', this.idFood], { relativeTo: this.activatedRoute })
  }

  changePaginateValue(e: any) {
    this.limit = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.foodService.paginateFoods(this.limit, this.pageIndex).subscribe();
  }

  changeEventCheckbox(checkboxChange: CheckboxChange){    
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
      // 'description', 
      'category', 
      'price', 
      'super', 
      'state', 
      'reserved.local'
    ];
    this.customColumnName = [
      { key: 'name',           header: 'نام' },
      // { key: 'description',    header: 'توضیحات' },
      { key: 'category',       header: 'دسته بندی' },
      { key: 'price',          header: 'قیمت' },
      { key: 'super',          header: 'غذای ویژه' },
      { key: 'state',          header: 'وضعیت غذای ویژه' },
      { key: 'reserved.local', header: 'رزرو' },
    ];
    
  }

  getDataSourceWithPageinate() {
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
}
