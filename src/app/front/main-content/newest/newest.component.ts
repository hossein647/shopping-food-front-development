import { Component, ElementRef, OnInit } from '@angular/core';
import { GlobalQuery } from 'src/app/state/global.query';
import { Food } from 'src/app/_user-profile/foods/state/food.model';
import { Snackbar } from 'src/app/__share/helper/snackbar';
import { GlobalFront } from '../../_interfaces/global-front.interface';
import { CardsService } from '../../_services/cards.service';
import { GlobalFrontService } from '../../_services/global-front.service';

@Component({
  selector: 'app-newest',
  templateUrl: './newest.component.html',
  styleUrls: ['./newest.component.scss']
})
export class NewestComponent implements OnInit {

  foods            : Food[];
  food             : Food;
  orderList        : GlobalFront;
  moreModalShow    : boolean = false;
  modalNoLogin     : ElementRef;
  notLoginModal    : HTMLElement;
  buyMessage       : string;
  averageRate      : number[] = [];
  showNotLoginModal: boolean = false;
  showOverlay      : boolean = false;
  loggedIn         : boolean | undefined = false;
  
  constructor(
    private _snackbar         : Snackbar,
    private globalFrontService: GlobalFrontService,
    private cardsService      : CardsService,
    private elRef             : ElementRef,
    private globalQuery       : GlobalQuery,
  ) { }

  ngOnInit(): void {
    this.notLoginModal = this.elRef.nativeElement.querySelector('.not-login-modal');
    this.buyMessage = 'برای خرید باید وارد حساب کاربری شوید.'
    this.newestFood();
    this.orderList = this.getCartLocalStorage(this.globalFrontService.getEmail());
    this.globalFrontService.getOrderFood().subscribe(orderFood => {
      this.orderList = orderFood;
    })
    this.updateGlobalFront(this.orderList);
  }


  newestFood() {
    this.cardsService.newest().subscribe(
      res => {
        if (res) {
          this.foods = res.foods;
          this.getAverageRate(this.foods);
        }
      }
    )
  }


  onCart(food: Food) {    
    if (this.globalQuery.isLoggedIn) {
      const key: string = `${food.name}_${food._id}`;

      if (!this.orderList[key]) this.orderList[key] = [];
      this.orderList[key].push(food);

      this.setCartLocalStorage(this.orderList, this.globalFrontService.getEmail());
      this.updateGlobalFront(this.getCartLocalStorage(this.globalFrontService.getEmail()));


      this._snackbar.addSnackbar('با موفقیت به سبد خرید اضافه شد', false, 3000);
    } else {
      this.showNotLoginModal = true;
      this.showOverlay = true;
    }
  }


  setCartLocalStorage(orderFood: GlobalFront, email: string) {
    window.localStorage.setItem(`orderFood_${email}`, JSON.stringify(orderFood));
  }


  getCartLocalStorage(email: string): GlobalFront {
    return JSON.parse(window.localStorage.getItem(`orderFood_${email}`) || '{}');
  }


  updateGlobalFront(orderFood: GlobalFront) {
    this.globalFrontService.updateOrderFood(orderFood);
  }


  showMoreModal(data: {food: Food, index: number}) {
    this.moreModalShow = true;
    this.showOverlay = true;
    this.food = this.foods[data.index];
  }

  closeMoreModal() {
    this.moreModalShow = false;
    this.showOverlay = false;
  }

  closeNoLoginModal() {
    this.showNotLoginModal = false;
    this.showOverlay = false;
  }

  getAverageRate(foods: Food[]) {
    foods?.forEach((food) => {      
      this.averageRate.push(+food.average?.toFixed(1));
    })
  }


  refreshFoodCard(foods: Food[]) {
    this.foods = foods
  }
}