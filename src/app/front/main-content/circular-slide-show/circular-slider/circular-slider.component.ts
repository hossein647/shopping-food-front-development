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
  @ViewChildren('imgLinearParent') imgLinearParent: QueryList<ElementRef>;
  @ViewChild('cover')                        cover: ElementRef;  

  
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
        console.log(res);
        
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
    this.circularService.getShowStates().subscribe(res => {
      if (res) this.foods = JSON.parse(JSON.stringify(res)).foods;      
    })
  }


  setPositionImageCircularSlider() {
    const slider = this.slider.nativeElement;
    this.renderer.setStyle(slider, 'outline', `${this.outlinWidthSlider}px solid rgb(212, 0, 255)`);

    this.imgCircular.changes.subscribe(images => {
      images.forEach((image: any, index: number) => {
        index++
        const foodImage = image.nativeElement;
        if (index === 1) this.calculatePositionImage_1(slider, foodImage, this.outlinWidthSlider);
        if (index === 2) this.calculatePositionImage_2(slider, foodImage, this.outlinWidthSlider);
        if (index === 3) this.calculatePositionImage_3(slider, foodImage, this.outlinWidthSlider);
        if (index === 4) this.calculatePositionImage_4(slider, foodImage, this.outlinWidthSlider);
      })
      this.renderer.setStyle(this.counter.nativeElement, 'transform', 'translateX(0)');
      this.renderer.setStyle(this.title.nativeElement, 'transform', 'translateX(0)');
      this.renderer.setStyle(this.linearSlider.nativeElement, 'transform', 'translateX(0)');
    })
  }



  onArrowRight(event: any) {
    this.clickSliding$.next(-1)
  }
  
  
  
  onArrowLeft(event: any) {
    this.clickSliding$.next(1)
  }

  setPositionCoverImage() {
    this.imgLinearParent.changes.subscribe(parents => {
      parents.forEach((parent: ElementRef, index: number) => {
        index++;        
        this.linearFoodOnMoment.subscribe(food => {   
          if (food.index === index) {            
            this.calculatePositonCoverImage(parent);
            this.foodIndex = food.index + '#';
            this.foodTitle = food.title;
          }
        })
      })
    })
  }

  calculatePositonCoverImage(parent: ElementRef) {
    const linearSlider = this.linearSlider.nativeElement.getBoundingClientRect();
    const coverPosition = this.cover.nativeElement.getBoundingClientRect();
    const ParentPosition = parent.nativeElement.getBoundingClientRect();
    const left = coverPosition.left - (coverPosition.left - ParentPosition.left) - linearSlider.left;

    this.renderer.addClass(this.cover.nativeElement, 'selected')
    this.renderer.setStyle(this.cover.nativeElement, 'width', `${ParentPosition.width}px`)
    this.renderer.setStyle(this.cover.nativeElement, 'height', `${ParentPosition.height}px`)
    this.renderer.setStyle(this.cover.nativeElement, 'left', `${left}px`);
  }

  emitDateSelectedImage(degree: number) { 
    let result: string = `${degree / 360}`;
    const num: number = Math.sign(degree / 360);

    if (+result < 0) result = '-' + result.slice(-3);
    
    if ((result.endsWith('.25') && num === 1) || (result.endsWith('-.75') && num === -1))
      this.linearFoodOnMoment.next({ index: 1, title: this.foods[0]?.name });
    if (result.endsWith('.5')) this.linearFoodOnMoment.next({ index: 2, title: this.foods[1]?.name });
    if ((result.endsWith('.75') && num === 1) || (result.endsWith('-.25')  && num === -1)) 
      this.linearFoodOnMoment.next({ index: 3, title: this.foods[2]?.name });
    if (Number.isInteger(degree / 360)) 
      this.linearFoodOnMoment.next({ index: 4, title: this.foods[3]?.name });
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
    this.setPositionStyle(image, -90);
  }

  calculatePositionImage_2(slider: HTMLElement, image: HTMLElement, outlinWidthSlider: number) {
    this.offsetLeftImage = (slider.offsetWidth / 2) - (image.offsetWidth / 2);
    this.offsetTopImage = ((image.offsetHeight - outlinWidthSlider) / 2) + outlinWidthSlider;
    this.setPositionStyle(image, -180, 'negative');
  }


  calculatePositionImage_3(slider: HTMLElement, image: HTMLElement, outlinWidthSlider: number) {
    this.offsetLeftImage = -(((image.offsetHeight - outlinWidthSlider) / 2) + outlinWidthSlider);
    this.offsetTopImage = (slider.offsetWidth / 2) - (image.offsetWidth / 2);
    this.setPositionStyle(image, 90);
  }

  calculatePositionImage_4(slider: HTMLElement, image: HTMLElement, outlinWidthSlider: number) {
    this.offsetLeftImage = (slider.offsetWidth / 2) - (image.offsetWidth / 2);
    this.offsetTopImage = slider.offsetWidth - ((image.offsetWidth - outlinWidthSlider) / 2);
    this.setPositionStyle(image, 0);
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


  ngOnDestroy(): void {
    this.isVisible$.next('hidden')
  }

}
