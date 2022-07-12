import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Food } from 'src/app/__dashboard/foods/state/food.model';
import { Snackbar } from 'src/app/___share/helper/snackbar';
import { GlobalFront } from '../../_interfaces/global-front.interface';
import { GlobalFrontService } from '../../_services/global-front.service';
import { CardsService } from '../../_services/cards.service';
import { GlobalQuery } from './../../../state/global.query'

@Component({
  selector: 'app-motst-papular',
  templateUrl: './motst-papular.component.html',
  styleUrls: ['./motst-papular.component.scss']
})
export class MotstPapularComponent implements OnInit {

  @ViewChildren('price')  price : QueryList<ElementRef>;
  @ViewChildren('copon')  copon : QueryList<ElementRef>;
  @ViewChildren('rating') rating: QueryList<ElementRef>;
  @ViewChildren('more')   more  : QueryList<ElementRef>;
  @ViewChild('overlay')   verlay: ElementRef;
  
  foods            : Food[];
  food             :  Food;
  orderList        : GlobalFront;
  moreModalShow    : boolean = false;
  modalNoLogin     : ElementRef;
  notLoginModal    : HTMLElement;
  buyMessage       : string;
  averageRate      : number[] = [];
  showNotLoginModal: boolean = false;
  showOverlay      : boolean = false;
  changeZIndex     : boolean = false;
  loggedIn         : boolean | undefined;
  
  constructor(
    private cardsService      : CardsService,
    private globalFrontService: GlobalFrontService,
    private globalQuery       : GlobalQuery,
    private _snackbar         : Snackbar,
    private elRef             : ElementRef,
  ) { }

  
  ngOnInit(): void {
    this.notLoginModal = this.elRef.nativeElement.querySelector('.not-login-modal');
    this.buyMessage = 'برای خرید باید وارد حساب کاربری شوید.'
    this.mostPopularFood();
    this.orderList = this.getCartLocalStorage(this.globalFrontService.getEmail());
    this.globalFrontService.getOrderFood().subscribe(orderFood => {
      this.orderList = orderFood;
    })
    this.updateGlobalFront(this.orderList);
  }


  mostPopularFood() {
    this.cardsService.popular().subscribe(
      res => {
        if (res) {          
          console.log(res);
                              
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


  closeNoLoginModal() {    
    this.showNotLoginModal = false;
    this.showOverlay = false;
  }


  showMoreModal(data: { food: Food, index: number }) {     
    this.moreModalShow = true;
    this.showOverlay = true;
    this.food = this.foods[data.index];
}

  closeMoreModal() {
    this.moreModalShow = false;
    this.showOverlay = false;
  }


  getAverageRate(foods: Food[]) {
    foods?.forEach((food) => {                 
        this.averageRate.push(+food.average.toFixed(1));
    })
  }


  refreshFoodCard(foods: Food[]) {
    this.foods = foods
  }

}
