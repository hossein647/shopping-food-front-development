import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OrderFood } from 'src/app/front/_interfaces/order-food.interface';
import { ColumnName } from 'src/app/__share/interface/column-name.interface';
import { CheckboxChange } from '../_share/interface/checkboxChange.interface';
import { PaymentService } from './payment.service';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss']
})
export class PaymentHistoryComponent implements OnInit {

  columnName: ColumnName[];
  dataSource: any;
  selection: any;
  displayedColumns: string[];

  totalDocs: number;
  pageSizeOptions: number[];
  pageIndex: number = 0;
  limit: number = 10;
  checked: boolean;
  noData: string;
  
  constructor(
    private paymentService: PaymentService,
  ) { }


  ngOnInit(): void {
    this.initDefaultValueTable();
    this.getDataSourceWithPageinate();
    
  }


  initDefaultValueTable() {
    this.selection = new SelectionModel(false, []);
    this.displayedColumns = ['select', 'name', 'lengthName', 'lengthPress', 'createdAt', 'totalText'];
    this.columnName = [
      { key: 'name',        header: 'نام'           },
      { key: 'lengthName',  header: 'نوع غذا'        },
      { key: 'lengthPress', header: 'تعداد غذا (پرس)'  },
      { key: 'createdAt',   header: 'تاریخ خرید'      },
      { key: 'totalText',   header: 'جمع حساب'      },
    ];
  }

  
  changePaginateValue(event: any) {
    this.limit = event.pageSize;
    this.pageIndex = event.pageIndex;

    this.paymentService.getAllPaymentsWithPaginage(this.limit, this.pageIndex).subscribe(
      res => {
        if (res) this.pipeOnResponseOrderFood(res)
      }
    );
  }


  changeEventCheckbox(data: CheckboxChange) {    
    this.checked = data.event.checked;
  }


  getDataSourceWithPageinate() {
    this.paymentService.getAllPaymentsWithPaginage(this.limit, this.pageIndex).subscribe(res => {
      if (res) {
        this.pipeOnResponseOrderFood(res)
      }
    })
  }


  pipeOnResponseOrderFood(res: any) {
    res.docs.forEach((payment: OrderFood, index: number) => {
      if (typeof payment.createdAt === 'string') {
        const localDate = new Date(payment.createdAt).toLocaleString(
          'fa-IR',
          { year: 'numeric', month: 'numeric', day: 'numeric' }
        )

        payment.createdAt = localDate;
        payment.lengthName = payment.name.length;
        payment.lengthPress = payment.press.reduce((prev, curr) => prev + curr);
        payment.totalText = payment.total.toLocaleString() + '  تومان';
      }

      this.totalDocs = res?.totalDocs;
      this.noData = res?.message;
      if (res.status === 403) this.noData = res?.error?.message;

      this.dataSource = new MatTableDataSource(res.docs);
      this.pageSizeOptions = [5, 15, 25, 50, 100];
    });
  }

}
