import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Food } from 'src/app/__dashboard/foods/state/food.model';
import { OrderFood } from '../_interfaces/order-food.interface';

@Component({
  selector: 'app-sidebar-pay',
  templateUrl: './sidebar-pay.component.html',
  styleUrls: ['./sidebar-pay.component.scss']
})
export class SidebarPayComponent implements OnInit, OnChanges {

  @Output() onCloseSidebarFood = new EventEmitter();
  @Output() onUpCounter        = new EventEmitter<number>();
  @Output() onDownCounter      = new EventEmitter<number>();
  @Output() onRemoveFood       = new EventEmitter<number>();
  @Output() onPay              = new EventEmitter();

  @Input() openOrderFood: boolean = true;
  @Input() foodsLength  : number[];
  @Input() orderFoodList: Food[] = [];
  @Input() sumPrice     : number;
  @Input() payList      : OrderFood;
  @Input() emptyPayList : boolean;

  constructor() {}


  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {      
      for (const key in changes) {
        const element = changes[key];
        if (key === 'emptyPayList')  this.emptyPayList  =  element.currentValue;
        if (key === 'orderFoodList') this.orderFoodList =  element.currentValue;
        if (key === 'payList')       this.payList       =  element.currentValue;
        if (key === 'sumPrice')      this.sumPrice      =  element.currentValue;
        if (key === 'foodsLength')   this.foodsLength   =  element.currentValue;
      }      
    }
    
  }

  
  ngOnInit(): void {}


  closeSidebarFood() {
    this.onCloseSidebarFood.emit()
  }


  removeFood(index: number) {
    this.onRemoveFood.emit(index)
  }


  upCounter(index: number) {
    this.onUpCounter.emit(index);
  }


  downCounter(index: number) {
    this.onDownCounter.emit(index);
  }



  pay() {
    this.onPay.emit()
  }

}
