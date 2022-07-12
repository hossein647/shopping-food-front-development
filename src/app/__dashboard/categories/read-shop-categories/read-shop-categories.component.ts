import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Snackbar } from 'src/app/___share/helper/snackbar';
import { ColumnName } from 'src/app/___share/interface/column-name.interface';
import { Category } from '../state/category.model';
import { CategoryService } from '../state/category.service';
import { CategoryPaginatorQuery } from '../state/state/category-paginator.query';
import { CategoryPaginatorService } from '../state/state/category-paginator.service';

@Component({
  selector: 'app-read-shop-categories',
  templateUrl: './read-shop-categories.component.html',
  styleUrls: ['./read-shop-categories.component.scss']
})
export class ReadShopCategoriesComponent implements OnInit {

  columnName      : ColumnName[];
  displayedColumns: string[];
  pageSizeOptions : number[];
  checked         : boolean;

  totalDocs       : number;
  pageIndex       : number;
  limit           : number;
  idCategory      : number;
  
  noData          : string;
  dataSource      : any;
  selection       : any;
  lastItemPage    : boolean;
  
  constructor(
    private categoryService        :  CategoryService,
    private categoryPaginateService: CategoryPaginatorService,
    private categoryPaginateQuery  : CategoryPaginatorQuery,
    private _snackbar              : Snackbar,
    private router                 : Router,
    private activatedRoute         : ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initDefaultValueTable();
    this.getCategoryFromService();
    this.getDataSourceWithPageinate();
    
  }


  removeCategory() {
    this.categoryService.remove(this.idCategory).subscribe(res => {
      const result = JSON.parse(JSON.stringify(res));      
      if (res) {
        this._snackbar.addSnackbar(result.message, result.err, 3000);
        if (this.lastItemPage && this.pageIndex > 0) this.pageIndex -= 1;
        this.categoryPaginateService.getAllCategoryWithPaginate(this.limit, this.pageIndex)
        .subscribe(); // request for refresh data
        this.checked = false;
      }
    })
  }

  changePaginateValue(e: any) {    
    this.limit = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.categoryPaginateService.getAllCategoryWithPaginate(this.limit, this.pageIndex).subscribe(
      res => {        
        this.lastItemPage = res.shopCategories?.docs.length === 1 ? true : false;        
      }
    );
  }

  changeEventCheckbox(data: any) {    
    this.checked = data.event.checked;
    const rowIndex = data.rowIndex;
    this.idCategory = this.dataSource.data?.[rowIndex]._id;
  }

  // init default create table
  initDefaultValueTable() {
    this.selection = new SelectionModel<Category>(false, []);
    this.displayedColumns = ['select', 'name', 'alias', 'image'];
    this.columnName = [
      { key: 'name', header: 'نام' },
      { key: 'alias', header: 'نام مستعار' },
      { key: 'image', header: 'تصویر' },
    ];
  }

  getDataSourceWithPageinate() {
    this.categoryPaginateQuery.select(state => state.entities).subscribe(res => {
      if (res) {
        const result = JSON.parse(JSON.stringify(res));

        const categories: Category[] = result.shopCategories?.docs;     
        this.totalDocs = result.shopCategories?.totalDocs;
        this.noData = result.error ? result.error.message : result.message;
        
        this.dataSource = new MatTableDataSource<Category>(categories);  
        this.pageSizeOptions = [5, 10, 15, 20, 30, 40, 50];
      }
    })
  }

  onEdit() {
    this.router.navigate(['edit', this.idCategory], {relativeTo: this.activatedRoute})
  }

  getCategoryFromService() {
    this.categoryPaginateService.getAllCategoryWithPaginate(this.limit = 5, this.pageIndex = 0)  // send request to server
    .subscribe()
  }

}
