import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, merge, Subject, Subscription, timer, EMPTY  } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Food } from 'src/app/__dashboard/foods/state/food.model';
import { environment } from 'src/environments/environment';
import { CircularService } from '../state/circular.service';

@Component({
  selector: 'app-circular-slider',
  templateUrl: './circular-slider.component.html',
  styleUrls: ['./circular-slider.component.scss']
})
export class CircularSliderComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('slider')                      slider: ElementRef;
  @ViewChild('container')                container: ElementRef;
  @ViewChild('leftButton')              leftButton: ElementRef;
  @ViewChild('rightButton')            rightButton: ElementRef;
  @ViewChild('linearSlider')          linearSlider: ElementRef;
  @ViewChild('counter')                    counter: ElementRef;
  @ViewChild('title')                        title: ElementRef;
  @ViewChildren('imgCircular')         imgCircular: QueryList<ElementRef>;
  @ViewChild('imgLinear')                imgLinear: QueryList<ElementRef>;  

  
  linearFoodOnMoment = new Subject<{index: number, title: string}>();
  firstEmit$         = new BehaviorSubject<string>('not emitted');
  isVisible$         = new BehaviorSubject<string>('no visible');
  clickSliding$         = new Subject<number>();
  subscription       = new Subscription();
  timer              = 0;
  savedTime          = 0;
  
  skip             : boolean = false;
  foods            : Food[] = [];
  outlinWidthSlider: number;
  savedDegree      : number;
  degree           : number;
  offsetTopImage   : number;
  offsetLeftImage  : number;
  foodIndex        : string;
  foodTitle        : string;
  arrowClicked     : boolean = false;
  notSeenPage      : boolean = false;
  clickSliding     : boolean = true;
  baseApi          : string  = environment.url;
  

  constructor(
    private renderer: Renderer2,
    private circularService: CircularService,
    private breakPoint: BreakpointObserver,
    private router: Router
    ) {
    }
    
    
  ngAfterViewInit(): void {      
    this.breakPoint.observe(['(max-width: 319px)']).subscribe(observe => {
      this.outlinWidthSlider = observe.breakpoints['(max-width: 319px)'] ? 70 : 90      
    })
    this.setPositionCoverImage();    
    this.setPositionImageCircularSlider();
  }
    
    
    
  ngOnInit(): void {
    this.updateToShowState(); // once in day
    this.getShowStateImages();
    this.completeYesterdaySuperFoods(); // once in day
    this.rotateSlider();
  }
  
  
  rotateSlider() {
    merge(this.isVisible$, this.firstEmit$, this.clickSliding$)
    .pipe(
      tap(value => {        
        this.notSeenPage = document.hidden;
        if (value === 'hidden') {
          this.savedTime = this.timer + 1;
          this.savedDegree = this.degree + 90;
        }
        if (typeof value === 'number') {
          this.savedTime = this.timer + value;
          if (value === 1) this.degree = this.degree + 90;
          if (value === -1) this.degree = this.degree - 90;
        }
      }),
      switchMap(value => value === 'not emitted' 
                ? timer(0, 500) 
                : value === 'hidden' || this.notSeenPage 
                ? EMPTY 
                : timer(0, 3000)),
      map((time) => {
        this.changeWidthEffect('out');
        return this.savedTime + time;
      }),
      )
      .subscribe(time => {   
        timer(300).subscribe(no => {
          this.timer = time; // saved time/
          this.degree = this.savedDegree + this.degree;
          this.degree = time * 90;
          
        if (time === 0 && !this.skip) {
          this.skip = true;
          this.savedTime = this.timer;
          this.firstEmit$.next('yes');
        }
        this.renderer.setStyle(this.slider.nativeElement, 'transform', `rotate(${this.degree}deg)`);
        this.emitDateSelectedImage(this.degree);
        this.changeWidthEffect('in')
      })
    })
  }


  @HostListener('document:visibilitychange', ['$event'])
  visiblePage(event: any) {
    this.isVisible$.next(document.visibilityState === 'visible' ? 'visible' : 'hidden');
  }


  updateToShowState() {
    this.circularService.getConfirmToday().subscribe(res => {
      if (res) {        
        const result = JSON.parse(JSON.stringify(res)).superFoods;          
        result.forEach((food: any) => {   
          this.circularService.updateToShowState(food._id).subscribe()
        })
      }
    })
  }


  completeYesterdaySuperFoods() {
    this.circularService.updateToCompleteState().subscribe();
  }



  getShowStateImages() {
    this.circularService.getShowStates().subscribe((res: any) => {   
      if (res?.foods.length > 0) this.foods = JSON.parse(JSON.stringify(res)).foods;
      else  this.foods = this.getDefaultSuperFoods() as  any;
    })
  }


  setPositionImageCircularSlider() {
    const slider = this.slider.nativeElement;
    this.renderer.setStyle(slider, 'outline', `${this.outlinWidthSlider}px solid rgba(188, 203, 191, 0.19)`);
    this.imgCircular.changes.subscribe(images => {
      images.forEach((image: any, index: number) => {
        index++
        const foodImage = image.nativeElement;
        if (index === 1) this.calculatePositionImage_3(slider, foodImage, this.outlinWidthSlider);
        if (index === 2) this.calculatePositionImage_4(slider, foodImage, this.outlinWidthSlider);
        if (index === 3) this.calculatePositionImage_1(slider, foodImage, this.outlinWidthSlider);
        if (index === 4) this.calculatePositionImage_2(slider, foodImage, this.outlinWidthSlider);
      })
      this.renderer.setStyle(this.counter.nativeElement, 'transform', 'translateX(0)');
      this.renderer.setStyle(this.title.nativeElement, 'transform', 'translateX(0)');
    })
  }



  onArrowRight(event: any) {
    this.clickSliding$.next(-1)
  }
  
  
  
  onArrowLeft(event: any) {
    this.clickSliding$.next(1)
  }

  setPositionCoverImage() {   
    this.linearFoodOnMoment.subscribe(food => {
        this.foodIndex = food.index + '#';
        this.foodTitle = food.title;
    })
  }


  emitDateSelectedImage(degree: number) { 
    let result: string = `${degree / 360}`;
    const num: number = Math.sign(degree / 360);
    
    if (+result < 0) result = '-' + result.slice(-3);
    
    if ((result.endsWith('.25') && num === 1) || (result.endsWith('-.75') && num === -1)) {              
      this.linearFoodOnMoment.next({ index: 1, title: this.foods[0]?.name });
    }

    if (result.endsWith('.5')) this.linearFoodOnMoment.next({ index: 2, title: this.foods[1]?.name });

    if ((result.endsWith('.75') && num === 1) || (result.endsWith('-.25')  && num === -1)) {
      this.linearFoodOnMoment.next({ index: 3, title: this.foods[2]?.name });
    }

    if (Number.isInteger(degree / 360)) {
      this.linearFoodOnMoment.next({ index: 4, title: this.foods[3]?.name });
    }
  }

  setPositionStyle(image: HTMLElement, rotate: number, top?: string) {
    if (top === 'negative') this.offsetTopImage = - this.offsetTopImage;
    this.renderer.setStyle(image, 'left', this.offsetLeftImage + 'px');
    this.renderer.setStyle(image, 'top', this.offsetTopImage + 'px');
    this.renderer.setStyle(image, 'transform', `rotate(${rotate}deg)`);
  }

  calculatePositionImage_1(slider: HTMLElement, image: HTMLElement, outlinWidthSlider: number) {
    this.offsetLeftImage = slider.offsetWidth - ((image.offsetHeight - outlinWidthSlider) / 2);
    this.offsetTopImage = (slider.offsetWidth / 2) - (image.offsetWidth / 2);
    this.setPositionStyle(image, 90);
  }

  calculatePositionImage_2(slider: HTMLElement, image: HTMLElement, outlinWidthSlider: number) {
    this.offsetLeftImage = (slider.offsetWidth / 2) - (image.offsetWidth / 2);
    this.offsetTopImage = ((image.offsetHeight - outlinWidthSlider) / 2) + outlinWidthSlider;
    this.setPositionStyle(image, 0, 'negative');
  }


  calculatePositionImage_3(slider: HTMLElement, image: HTMLElement, outlinWidthSlider: number) {
    this.offsetLeftImage = -(((image.offsetHeight - outlinWidthSlider) / 2) + outlinWidthSlider);
    this.offsetTopImage = (slider.offsetWidth / 2) - (image.offsetWidth / 2);
    this.setPositionStyle(image, 270);
  }

  calculatePositionImage_4(slider: HTMLElement, image: HTMLElement, outlinWidthSlider: number) {
    this.offsetLeftImage = (slider.offsetWidth / 2) - (image.offsetWidth / 2);
    this.offsetTopImage = slider.offsetWidth - ((image.offsetWidth - outlinWidthSlider) / 2);
    this.setPositionStyle(image, -180);
  }

  changeWidthEffect(effect: string) {
    if (effect === 'in') {
      this.renderer.setStyle(this.title.nativeElement, 'transition', 'all .3s ease-in');
      this.renderer.setStyle(this.title.nativeElement, 'width', `100%`);
      this.renderer.setStyle(this.counter.nativeElement, 'transition', 'all .3s ease-in');
      this.renderer.setStyle(this.counter.nativeElement, 'width', `60px`);
    }
  
    if (effect === 'out') {
      this.renderer.setStyle(this.title.nativeElement, 'width', '0');
      this.renderer.setStyle(this.title.nativeElement, 'transition', 'all .3s ease-in');
      this.renderer.setStyle(this.counter.nativeElement, 'width', '0');
      this.renderer.setStyle(this.counter.nativeElement, 'transition', 'all .3s ease-in');
    }
  }


  navigetToFood(foods: Food[], foodTitle: string) {
    const food = foods.filter(food => food.name === foodTitle)[0];
    this.circularService.getPopulatedShop(food.shop, food.name).subscribe(
      res => {
        if (res) this.router.navigate([`shops/${res[0].shop_category.alias}/${res[0].shop._id}`])
      }
    )
  }



  getDefaultSuperFoods() {
    return [
      {
        "_id": "62caa8344fb629cd46a35361",
        "comment": [
          "62caa8654fb629cd46a35371"
        ],
        "rating": [
          {
            "userId": "62c1b8b388924809102e8e6b",
            "rate": 5
          }
        ],
        "reserved": {
          "original": 1693166358482.0,
          "local": "یکشنبه ۵ شهریور ۱۴۰۲ "
        },
        "state": "تایید",
        "super": true,
        "name": "چلو کباب کوبیده",
        "description": "۲ سیخ ۱۰۰ گرمی مخلوط گوشت گوساله و گوسفندی، برنج ایرانی، فلفل، ترشی کلم، لیمو، نارنج، گوجه کبابی",
        "category": "کباب گوشت",
        "shop": "آزادی",
        "subFood": "کباب گوشت",
        "price": 57800,
        "copon": 7900,
        "image": "576-5762035_koobideh-kabob-kebab-png-top-view-transparent-png-85106-ac89.png",
        "imageId": "64e4cd349d81489e36815553",
        "userId": "62c1b8ec88924809102e8e70",
        "createdAt": "2022-07-10T10:21:40.157+0000",
        "updatedAt": "2023-08-26T19:59:18.484+0000",
        
      },
      {
        "_id": "62cb1f81781babfa344d67a2",
        "comment": [

        ],
        "rating": [
          {
            "userId": "62c1b8b388924809102e8e6b",
            "rate": 5
          },
          {
            "userId": "62cb468f137b4ad8ef91cfaf",
            "rate": 5
          }
        ],
        "reserved": {
          "original": 1693166574248.0,
          "local": "یکشنبه ۵ شهریور ۱۴۰۲ "
        },
        "state": "تایید",
        "super": true,
        "name": "چلو کباب بختیاری",
        "description": "۱۲۰ گرم کباب برگ گوشت گوسفندی، ۱۲۵ گرم شنیسل مرغ، برنج ایرانی، فلفل، ترشی کلم، لیمو، نارنج، گوجه کبابی",
        "category": "کباب گوشت",
        "shop": "آزادی",
        "subFood": "کباب گوشت",
        "price": 97300,
        "copon": null,
        "image": "Sultani-Kabab-d668.jpg",
        "imageId": "64e5cb469d81489e36815826",
        "userId": "62c1b8ec88924809102e8e70",
        "createdAt": "2022-07-10T18:50:41.748+0000",
        "updatedAt": "2023-08-26T20:02:54.249+0000",
        
      },
      {
        "_id": "62cc061d486bbef38c06a717",
        "comment": [

        ],
        "rating": [

        ],
        "reserved": {
          "original": 1693166085524.0,
          "local": "یکشنبه ۵ شهریور ۱۴۰۲ "
        },
        "state": "تایید",
        "super": true,
        "name": "پیتزا مخلوط",
        "description": "خمیر پیتزا کلاسیک ۳۰ سانتی متری، ژامبون گوشت و مرغ، هات داگ فرانکفورتر، قارچ، زیتون، گوجه فرنگی، فلفل دلمه‌ ای، پنیر موزارلا، سس مخصوص، سیب زمینی سرخ شده",
        "category": "پیتزا",
        "shop": "ستارخان",
        "subFood": "پرطرفدار",
        "price": 112000,
        "copon": 128000,
        "image": "pizza-da2a.png",
        "imageId": "64ea0def9d81489e36816006",
        "userId": "62cbfaf1486bbef38c06a649",
        "createdAt": "2022-07-11T11:14:37.648+0000",
        "updatedAt": "2023-08-26T19:54:45.525+0000",
        
      },
      {
        "_id": "62d048ebd9d42f68727d4a5e",
        "comment": [

        ],
        "rating": [

        ],
        "reserved": {
          "original": 1693166093250.0,
          "local": "یکشنبه ۵ شهریور ۱۴۰۲ "
        },
        "state": "تایید",
        "super": true,
        "name": "خوراک ماهی قزل آلا کبابی",
        "description": "۴۰۰ گرم ماهی، نان لواش، دورچین",
        "category": "ماهی",
        "shop": "لاله",
        "subFood": "ماهی",
        "price": 157000,
        "copon": null,
        "image": "main-qimg-3011cd9b472121fd69238b0e640d4c38-4e9f.jpg",
        "imageId": "64ea04e09d81489e36815994",
        "userId": "62cc46ae400cb71607efaf27",
        "createdAt": "2022-07-14T16:48:43.425+0000",
        "updatedAt": "2023-08-26T19:56:13.904+0000",
        
      }
    ]
  }



  ngOnDestroy(): void {
    this.isVisible$.next('hidden')
  }

}
