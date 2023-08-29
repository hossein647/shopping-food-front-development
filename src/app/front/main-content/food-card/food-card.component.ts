import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Food } from 'src/app/__dashboard/foods/state/food.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-food-card',
  templateUrl: './food-card.component.html',
  styleUrls: ['./food-card.component.scss']
})
export class FoodCardComponent implements OnInit {

  baseApi: string = environment.url;
  @Input() foods      : Food[];
  @Input() averageRate: number[];
  @Input() buyMessage : string;

  @Output() onCart = new EventEmitter();
  @Output() onShowOrModal = new EventEmitter<{food: Food, index: number}>();

  constructor() {}

  ngOnInit(): void {}


  cart(food: Food) {
    this.onCart.emit(food);
  }


  showMoreModal(food: Food, index: number) {    
    this.onShowOrModal.emit({ food, index})
  }
  

}
