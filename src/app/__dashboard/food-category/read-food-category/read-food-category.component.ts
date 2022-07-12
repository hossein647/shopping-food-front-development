import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { Snackbar } from 'src/app/___share/helper/snackbar';
import { ColumnName } from 'src/app/___share/interface/column-name.interface';
import { FoodCategory } from '../state/food-category.model';
import { FoodCategoryQuery } from '../state/food-category.query';
import { FoodCategoryService } from '../state/food-category.service';

@Component({
  selector: 'app-read-food-category',
  templateUrl: './read-food-category.component.html',
  styleUrls: ['./read-food-category.component.scss']
})
export class ReadFoodCategoryComponent implements OnInit {


  columnName      : ColumnName[];
  dataSource      : any;
  selection       : any;
  displayedColumns: string[];

  totalDocs       : number;
  pageSizeOptions : number[];
  pageIndex       : number;
  limit           : number;
  idFoodCategory  : number;
  checked         : boolean;
  noData          : string;

  
  constructor(
    private foodCategoryService: FoodCategoryService,
    private foodCategoryQuery  : FoodCategoryQuery,
    private _snackbar          : Snackbar,
    private router             : Router,
    private activatedRoute     : ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initDefaultValueTable();
    this.foodCategoryService.getAllCategoryWithPaginate(this.limit = 5, this.pageIndex = 0).subscribe();  // send request to server
    this.getDataSourceWithPageinate();
  }


  removeFoodCategory() {
    this.foodCategoryService.remove(this.idFoodCategory).subscribe(res => {
      const result = JSON.parse(JSON.stringify(res));
      if (res) {
        this._snackbar.addSnackbar(result.message, result.err, 3000);
        this.foodCategoryService.getAllCategoryWithPaginate(this.limit, this.pageIndex).subscribe(); // request for refresh data
        this.checked = false;
      }
    })
  }

  changePaginateValue(e: any) {
    this.limit = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.foodCategoryService.getAllCategoryWithPaginate(this.limit, this.pageIndex).subscribe();
  }

  changeEventCheckbox(data: any) {
    this.checked = data.event.checked;
    const rowIndex = data.rowIndex;
    this.idFoodCategory = this.dataSource.data?.[rowIndex]._id;
  }

  initDefaultValueTable() {
    this.selection = new SelectionModel<FoodCategory>(false, []);
    this.displayedColumns = ['select', 'name', 'shopCategory'];
    this.columnName = [
      { key: 'name', header: 'نام' },
      { key: 'shopCategory', header: 'دسته بندی' },
    ];
  }

  getDataSourceWithPageinate() {
    this.foodCategoryQuery.select(state => state.entities).subscribe(res => { 
      if (res)      {
        const result = JSON.parse(JSON.stringify(res));

        const FoodCategories = result.foodCategories?.docs;        
        this.totalDocs = result.foodCategories?.totalDocs; 
        this.noData = result.message;       
        if (result.status === 403) this.noData = result.error.message;

        this.dataSource = new MatTableDataSource<FoodCategory>(FoodCategories);
        this.pageSizeOptions = [5, 10, 15, 20, 30, 40, 50];
      }
    })
  }

  onEdit() {
    this.router.navigate(['edit', this.idFoodCategory], { relativeTo: this.activatedRoute })
  }

}
