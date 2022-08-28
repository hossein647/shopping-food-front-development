import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { UserService } from 'src/app/auth/state/user.service';
import { GlobalService } from 'src/app/state/global.service';
import { Food } from 'src/app/__dashboard/foods/state/food.model';
import { LocalStorageData } from 'src/app/___share/helper/local-storage-data';
import { Snackbar } from 'src/app/___share/helper/snackbar';
import { GlobalFrontService } from '../_services/global-front.service';
import { OrderFood } from '../_interfaces/order-food.interface';
import { OrderFoOdService } from '../_services/order-food.service';
import { GlobalFront } from '../_interfaces/global-front.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  orderFoodLength: number;
  openOrderFood  : boolean = true;
  foodsLength    : number[] = [];
  orderFoodList  : Food[] = [];
  orderFood      : HTMLElement;
  sumPrice       : number = 0;
  payList        : OrderFood;
  emptyPayList   : boolean;
  loggedIn       : boolean = false;
  email          : string;
  expire         : any;
  windowWidth    : number;
  toggleDropdown : boolean = false;
  showSidebarMenu: boolean = false;
  homePage           : boolean = false;

  @ViewChild('dropdown') dropdown: ElementRef;
  scrolled: boolean;

  constructor(
    private userService       : UserService,
    private globalService     : GlobalService,
    private _snackbar         : Snackbar,
    private router            : Router,
    private localStorageData  : LocalStorageData,
    private render            : Renderer2,
    private globalFrontService: GlobalFrontService,
    private cdr               : ChangeDetectorRef,
    private orderFoodService  : OrderFoOdService,
    private elRef             : ElementRef,
    ) { 
      this.setMarginExceptHomePage();
    }
  
  ngOnInit(): void {     
    this.hasCookie();      
    this.orderFood = this.elRef.nativeElement.querySelector('.order-food');
    this.getOrderList();    
    this.globalFrontService.lengthOrderFood().subscribe(length => this.orderFoodLength = length);
  }


  manageAccount() {    
    this.router.navigate(['/__dashboard']);
  }
  
  
  logout() {
    this.userService.logout().subscribe(res => {
      if (res) {
        const result = JSON.parse(JSON.stringify(res));
        this.loggedIn = result.loggedIn;
        this.globalService.update(result.loggedIn);
        this.removeUser();
        
        const hamburger = this.elRef.nativeElement.querySelector('.hamburger');        
        this.showSidebarMenu = false;
        
        if (hamburger.classList.contains('line')) hamburger.parentNode.classList.remove('change');
        if (hamburger.classList.contains('hamburger')) hamburger.classList.remove('change');

        this._snackbar.addSnackbar(result.message, result?.err, 3000);
        this.router.navigate(['/']);

      }
    })
  }


  showAccountDropdown() {
    this.toggleDropdown = !this.toggleDropdown;
  }

  
  toggleHamburger(event: any) {
    const html = document.querySelector('html');   
    const element = event.target;  

    this.showSidebarMenu = !this.showSidebarMenu;   
    
    if (this.showSidebarMenu) {
      this.closeSidebarFood();
      this.render.setStyle(html, 'overflow', 'hidden');
    }else {
      this.render.removeStyle(html, 'overflow');
    }

    if (element.classList.contains('hamburger')) element.classList.toggle('change');
    if (element.classList.contains('line')) element.parentNode.classList.toggle('change');
  }

  checkUserExpire() {
    this.expire = this.localStorageData.checkUserExpire('elsfu');
    this.email = this.expire?.email
  }

  removeUser() {
    this.localStorageData.remove('elsfu')
  }

  hasCookie() {
    this.userService.hasCookie().subscribe(res => {            
      if (res) {
        const result = JSON.parse(JSON.stringify(res));      
        this.loggedIn = result.loggedIn;
        this.globalService.update({ loggedIn: this.loggedIn });         
        this.checkUserExpire();        
         
        if (this.loggedIn === false) this.router.navigate(['/'])    
      }
    })
  } 


  openSidebarFood(opened: boolean) {    
    this.openOrderFood = opened;    
    this.render.setStyle(this.orderFood, 'transform', 'translateX(0)');
  }

  closeSidebarFood() {
    this.openOrderFood = false;
    this.render.setStyle(this.orderFood, 'transform', 'translateX(-100%)');
  }


  getOrderList() {
    this.globalFrontService.getOrderFood().subscribe(global => {       
      this.emptyPayList = Object.keys(global).length === 0 ? true : false;
      
      this.orderFoodList = [];  

      this.calculateFoodLength(global);
      this.calculateSumPrice(global);
      for (const key of Object.keys(global)) {
        if (global[key].length > 0) {
          this.orderFoodList.push(global[key][0]);        
        }
      }             

    })
  }


  calculateSumPrice(orderFood: GlobalFront) {
    this.sumPrice = 0    
    for (const key of Object.keys(orderFood)) {       
      if (orderFood[key].length) {
        this.sumPrice += orderFood[key].length * orderFood[key][0].price;
      }
    }
  }
  
  
  calculateFoodLength(orderFood: GlobalFront) {    
    this.foodsLength = [];
    for (const key of Object.keys(orderFood)) {
      this.foodsLength.push(orderFood[key].length);      
    }
  }

  removeFood(index: number) {    
    const email = this.globalFrontService.getEmail() ;
    const key       = this.orderFoodList[index].name + '_' + this.orderFoodList[index]._id;   
    const orderFood = JSON.parse(window.localStorage.getItem(`orderFood_${email}`) || '[]');
    
    Reflect.deleteProperty(orderFood, key);
    window.localStorage.setItem(`orderFood_${email}`, JSON.stringify(orderFood));
    this.globalFrontService.updateOrderFood(orderFood);

  }


  upCounter(index: number) {
    const email = this.globalFrontService.getEmail();
    const key = this.orderFoodList[index].name + '_' + this.orderFoodList[index]._id;
    const orderFood = JSON.parse(window.localStorage.getItem(`orderFood_${email}`) || '[]');
    
    Object(orderFood)[key].push(orderFood[key][0]);
    window.localStorage.setItem(`orderFood_${email}`, JSON.stringify(orderFood));
    
    this.globalFrontService.updateOrderFood(orderFood);
  }
  
  
  downCounter(index: number) {
    const email = this.globalFrontService.getEmail();
    const key = this.orderFoodList[index].name + '_' + this.orderFoodList[index]._id;
    const orderFood = JSON.parse(window.localStorage.getItem(`orderFood_${email}`) || '[]');

    Object(orderFood)[key].splice(0, 1);
    if (orderFood[key].length === 0) Reflect.deleteProperty(orderFood, key);
    window.localStorage.setItem(`orderFood_${email}`, JSON.stringify(orderFood));
    this.globalFrontService.updateOrderFood(orderFood);

  }



  pay() {
    const sumPrice: number[] = [];
    const name    : string[] = [];
    const price   : number[] = [];
    const press   : number[] = [];

    for (let i = 0; i < this.orderFoodList.length; i++) {
      sumPrice.push(this.orderFoodList[i].price * this.foodsLength[i]);
      name.push(this.orderFoodList[i].name);
      price.push(this.orderFoodList[i].price);
      press.push(this.foodsLength[i]);
      
      this.payList = { 
        name,
        price,
        press,
        sumPrice,
        total: sumPrice.reduce((prev, curr) => prev + curr)
      }
    }
    
    this.orderFoodService.create(this.payList).subscribe(
      res => {
        if (res) {
          if (!res?.err) {
            this._snackbar.addSnackbar(res.message, res?.err, 3000);
            this.orderFoodList = [];
            const email = this.globalFrontService.getEmail();
            localStorage.removeItem(`orderFood_${email}`);
            this.globalFrontService.updateOrderFood({});
            this.openOrderFood = false;
            this.render.setStyle(this.orderFood, 'transform', 'translateX(-100%)');
          }
        }
      }
    )
  }


  showSidebarPay(event: any) {
    this.openOrderFood = true;
    this.render.setStyle(this.orderFood, 'transform', 'translateX(0)');

    const hamburger = this.elRef.nativeElement.querySelector('.hamburger');
    this.showSidebarMenu = false;

    if (hamburger.classList.contains('hamburger')) hamburger.classList.toggle('change');
    if (hamburger.classList.contains('line')) hamburger.parentNode.classList.toggle('change');
    
  }


  setMarginExceptHomePage() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/') this.homePage = true;
        else this.homePage = false;
      }
    })
  }
  
  @HostListener('body:scroll', ['$event']) onScroll(event: any) {    
    if (event.target.scrollTop > 66) this.scrolled = true;
    else this.scrolled = false;
  }


}
