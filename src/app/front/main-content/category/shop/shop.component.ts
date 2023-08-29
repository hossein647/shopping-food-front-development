import { Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalFront } from 'src/app/front/_interfaces/global-front.interface';
import { FoodService } from 'src/app/front/_services/food.service';
import { GlobalFrontService } from 'src/app/front/_services/global-front.service';
import { ShopsService } from 'src/app/front/_services/shops.service';
import { SubFoodService } from 'src/app/front/_services/sub-food.service';
import { Food } from 'src/app/__dashboard/foods/state/food.model';
import { Shop } from 'src/app/__dashboard/shops/state/shop/shop.model';
import { SubFood } from 'src/app/__dashboard/sub-category-food/state/sub-food.model';
import { Snackbar } from 'src/app/___share/helper/snackbar';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  shop             : Shop;
  foods            : Food[] = [];
  filterFoods      : Food[] = [];
  subFood          : SubFood[] = [];
  foodsUrlImage    : any[] = [];
  food             : Food;
  moreModalShow    : boolean = false;
  orderList        : GlobalFront;
  message          : string;
  showNotLoginModal: boolean = false;
  shopRate         : number = 0;
  foodsMessage     : string;
  subFoodSelected  : string;
  changeSubFood    : boolean = false;
  showModalClicked : boolean = false;
  indexSubFood     : number;
  baseApi          : string = environment.url;

  @ViewChildren('sectionSubFood') sectionSubFood: QueryList<ElementRef>;
  @ViewChild('foodMenu') foodMenu               : ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private foodService: FoodService,
    private subFoodService: SubFoodService,
    private shopService: ShopsService,
    private renderer: Renderer2,
    private _snackbar: Snackbar,
    private globalFrontService: GlobalFrontService,
  ) { }

  
  ngOnInit(): void {
    this.message = 'برای خرید باید وارد حساب کاربری شوید.';
    this.getIdFromRoute();
    const guest = this.globalFrontService.isExistGuest();
    const email = this.globalFrontService.getEmail();
    const currentUser = (!guest && !email) || guest ? 'guest' : email;
    this.orderList = this.getCartLocalStorage(currentUser);
    this.globalFrontService.getOrderFood().subscribe(orderFood => {
      this.orderList = orderFood;      
    })
    this.updateGlobalFront(this.orderList);
  }


  getShop(id: number) {
    this.shopService.getSingleShops(id).subscribe(
      res => {
        if (res) {
          this.shop = res.shops;          
        }
      }
    )
  }


  getFoodsOfShop(id: number) {
    this.foodService.getAllByShopId(id).subscribe(
      res => {
        if (res) {       
          if (res.foods) {            
            this.foods = res.foods;            
            this.foods.forEach((food, index) => {
              this.shopRate += food.average;
              if (index + 1 === this.foods.length) {
                this.shopRate = +(this.shopRate / this.foods.length).toFixed(1)
              }
            })
            this.getSubFoods(this.foods[0].shop)
          } else {
            this.foodsMessage = res.message
          }
        }
      }
    )
  }
    
    
  getIdFromRoute() {
    this.activatedRoute.params.subscribe(
      params => {
        const id = params.id;
        this.getFoodsOfShop(id);
        this.getShop(id);
     }
    )
  }


  getSubFoods(shop: string) {
    this.subFoodService.getSubFoods(shop).subscribe(
      res => {
        if (res) {
          this.subFood = res.subFood;        
          this.filterFoods = this.foods.filter(food => food.subFood === this.subFood[0]?.name);
          this.subFoodSelected = this.subFood[0].name;
          this.sectionSubFood.forEach((section, index) => {
            if(index === 0) {
              section.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          })
        }
      }
    )
  }


  onSubFoodClick(shapeSelctor: HTMLElement, borderSelector: HTMLElement, sub: SubFood, index: number) {

    this.subFoodSelected = sub.name;
    this.translateYElement(shapeSelctor, index);
    this.translateYElement(borderSelector, index);
    
    
    this.sectionSubFood.forEach((section, i) => {
     if (i === index) {
       section.nativeElement.scrollIntoView({ behavior: "smooth", block: "start"})
     }
    })

    setTimeout(() => {
      this.filterFoods = this.foods.filter(food => food.subFood === sub.name);
    }, 300);
    
  }


  addToCart(event: any, food: Food) {
      const key: string = `${food.name}_${food._id}`;

      if (!this.orderList[key]) this.orderList[key] = [];
      this.orderList[key].push(food);

      const guest = this.globalFrontService.isExistGuest();
      const email = this.globalFrontService.getEmail();
    const currentUser = (!guest && !email) || guest ? 'guest' : email;
      this.setCartLocalStorage(this.orderList, currentUser);
      this.updateGlobalFront(this.getCartLocalStorage(currentUser));

      this._snackbar.addSnackbar('با موفقیت به سبد خرید اضافه شد', false, 3000);
    
  }


  closeMoreModal() {
    this.moreModalShow = false;
  }


  showMoreModal(food: Food) {
    this.moreModalShow = true;
    this.food = food;
  }


  getCartLocalStorage(email: string): GlobalFront {
    return JSON.parse(window.localStorage.getItem(`orderFood_${email}`) || '{}');
  }


  setCartLocalStorage(orderFood: GlobalFront, email: string) {
    window.localStorage.setItem(`orderFood_${email}`, JSON.stringify(orderFood));
  }


  updateGlobalFront(orderFood: GlobalFront) {
    this.globalFrontService.updateOrderFood(orderFood);
  }

  closeNoLoginModal() {
    this.showNotLoginModal = false;
  }


  filterFoodsBySubFood(foods: Food[]) {
    const subFoods = this.subFood.map(sub => sub.name);
    let foodsSortBySubFood: any[] = [];
    let helper: any = {}
    subFoods.forEach(sub => helper[sub] = foods.filter(food => food.subFood === sub))
    foodsSortBySubFood.push(helper);
    
    return foodsSortBySubFood[0] || [];
  }
 
  translateYElement(element: HTMLElement, index: number) {
    this.renderer.setStyle(element, 'transform', `translateY(${index * 44}px)`);
  }
}
