import { CheckboxChange } from './../../_share/interface/checkboxChange.interface';
import { Component, OnInit } from '@angular/core';
import { ColumnName } from 'src/app/___share/interface/column-name.interface';
import { Shop } from './../state/shop/shop.model';
import { ShopsService } from '../state/shop/shops.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ShopPaginateService } from '../state/shop-paginate/shop-paginate.service';
import { ShopPaginateQuery } from '../state/shop-paginate/shop-paginate.query';
import { ActivatedRoute, Router } from '@angular/router';
import { Snackbar } from 'src/app/___share/helper/snackbar';
import { CategoryService } from '../../categories/state/category.service';

@Component({
  selector: 'app-read-shops',
  templateUrl: './read-shops.component.html',
  styleUrls: ['./read-shops.component.scss']
})
export class ReadShopsComponent implements OnInit {

  columnName      : ColumnName[];
  dataSource      : any;
  selection       : any;
  displayedColumns: string[];

  totalDocs       : number;
  pageSizeOptions : number[];
  pageIndex       : number;
  limit           : number;
  idShop          : number;
  checked         : boolean;
  noData          : string;
  
  constructor(
    private shopService        : ShopsService,
    private shopPaginateService: ShopPaginateService,
    private shopPaginateQuery  : ShopPaginateQuery,
    private _snackbar          : Snackbar,
    private router             : Router,
    private activatedRoute     : ActivatedRoute,
    private categoryService    : CategoryService,
  ) { 
    
  }

  ngOnInit(): void {
    this.initDefaultValueTable(); 
    this.shopPaginateService.getAllShopWithPaginate(this.limit = 10, this.pageIndex = 0).subscribe();  
    this.getDataSourceWithPageinate();    
  }

   // init default create table
  initDefaultValueTable() {
    this.selection = new SelectionModel<Shop>(false, []);
    this.displayedColumns = ['select', 'name', 'description', 'category', 'address', 'phone', 'image'];
    this.columnName  = [
      {key: 'name', header: 'نام'},
      {key: 'description', header: 'توضیحات'},
      { key: 'category', header: 'دسته بندی'},
      {key: 'address', header: 'آدرس'},
      {key: 'phone', header: 'تلفن'},
      {key: 'image', header: 'تصویر'},
    ];
  }

  changePaginateValue(e: any) {
    this.limit = e.pageSize;
    this.pageIndex = e.pageIndex;        
    this.shopPaginateService.getAllShopWithPaginate(this.limit, this.pageIndex).subscribe();
  }

  changeEventCheckbox(data: CheckboxChange) {
    this.checked = data.event.checked;
    const rowIndex = data.rowIndex;
    this.idShop = this.dataSource.data?.[rowIndex]._id;    
  }

  removeShop() {
    this.shopService.remove(this.idShop).subscribe(res => {
      if (res) {
        const result = JSON.parse(JSON.stringify(res));
        this._snackbar.addSnackbar(result.message, result?.err, 3000);
        this.shopPaginateService.getAllShopWithPaginate(this.limit, this.pageIndex).subscribe(); 
        this.checked = false;
      }
    })
  }

  getDataSourceWithPageinate() {
    this.shopPaginateQuery.select(state => state.entities).subscribe(res => {    
      if (res) {
        const result = JSON.parse(JSON.stringify(res));

        const shops = result.shops?.['docs'];      
        this.totalDocs = result.shops?.totalDocs;
        this.noData = result.message;
        if (result.status === 403) this.noData = result.error?.message;

        this.dataSource = new MatTableDataSource<Shop>(shops);  
        this.pageSizeOptions = [5, 10, 15, 20, 30, 40, 50];
      }
    })
  }

  onEdit() {
    this.router.navigate(['edit', this.idShop], { relativeTo: this.activatedRoute })
  }
}
