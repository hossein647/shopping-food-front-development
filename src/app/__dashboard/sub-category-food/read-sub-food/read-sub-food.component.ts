import { SubFood } from './../state/sub-food.model';
import { SubFoodService } from './../state/sub-food.service';
import { Component, OnInit } from '@angular/core';
import { ColumnName } from 'src/app/___share/interface/column-name.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { Snackbar } from 'src/app/___share/helper/snackbar';

@Component({
  selector: 'app-read-sub-food',
  templateUrl: './read-sub-food.component.html',
  styleUrls: ['./read-sub-food.component.scss']
})
export class ReadSubFoodComponent implements OnInit {


  columnName      : ColumnName[];
  dataSource      : any;
  selection       : any;
  displayedColumns: string[];

  totalDocs       : number;
  pageSizeOptions : number[];
  pageIndex       : number = 0;
  limit           : number = 5;
  idShop          : number;
  checked         : boolean;
  noData          : string;
  idSubFood       : number;


  constructor(
    private subFoodService: SubFoodService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _snackbar: Snackbar,
  ) { }

  ngOnInit(): void {
    this.initDefaultValueTable();
    this.getDataSourceWithPageinate();
  }


  remove() {        
    this.subFoodService.remove(this.idSubFood).subscribe(res => {
      if (res) {              
        const result = JSON.parse(JSON.stringify(res));
        this._snackbar.addSnackbar(result.message, result.err, 3000);
        if (this.totalDocs % 5 === 1) this.pageIndex -= 1;
        this.getDataSourceWithPageinate();  // request for refresh data
        this.checked = false;
      }
    })
  }

  changePaginateValue(e: any) {
    this.limit = e.pageSize;
    this.pageIndex = e.pageIndex;  
    this.getDataSourceWithPageinate()
  }

  changeEventCheckbox(data: any) {
    this.checked = data.event.checked;
    const rowIndex = data.rowIndex;
    this.idSubFood = this.dataSource.data?.[rowIndex]._id;
  }

  initDefaultValueTable() {
    this.selection = new SelectionModel<SubFood>(false, []);
    this.displayedColumns = ['select', 'name', 'shop'];
    this.columnName = [
      { key: 'name', header: 'نام' },
      { key: 'shop', header: 'رستوران' },
    ];
  }

  getDataSourceWithPageinate() {
    this.subFoodService.getAllPaginate(this.limit, this.pageIndex).subscribe(res => { 
      if (res)      {        
        const subFoods = res.subFood?.docs;        
        this.totalDocs = res.subFood?.totalDocs; 
        this.noData = res.message;       

        if (res.status === 403) this.noData = res.error.message;
        
        this.dataSource = new MatTableDataSource<SubFood>(subFoods);
        this.pageSizeOptions = [5, 10, 15, 20, 30, 40, 50];
      }
    })
  }

  
  edit() {
    this.router.navigate(['edit', this.idSubFood], { relativeTo: this.activatedRoute })
  }

}
