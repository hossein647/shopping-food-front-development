import {  ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { GlobalService } from 'src/app/state/global.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnChanges {

  @Input() loggedIn : boolean;
  @Input() email    : string;
  @Output() onManageAccount   = new EventEmitter();
  @Output() onlogout          = new EventEmitter();
  @Output() onToggleHamburger = new EventEmitter<Event>();
  @Output() openOrderFood = new EventEmitter<boolean>()
   
  @Input() orderFoodLength: number;
  @Input() sidebarShow    : boolean;
  @Input() scrolled       : boolean;
  currentRoute: string = '/';
   
  constructor(
    private globalService: GlobalService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
  ) {
    this.router.events.subscribe(route => {
      if (route instanceof NavigationEnd) {
        this.currentRoute = route.url;
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      for (const key in changes) {        
        if (key === 'loggedIn')  this.loggedIn = changes[key].currentValue;
        if (key === 'email')     this.email    = changes[key].currentValue;        
        this.cdRef.detectChanges();
        this.globalService.update({ loggedIn: this.loggedIn });       
      }
    }
  }

  ngOnInit(): void {}


  manageAccount() {
    this.onManageAccount.emit();
  }

  logout() {
    this.onlogout.emit();
  }

  toggleHamburger(event: Event) {        
    this.onToggleHamburger.emit(event);
  }


  showSidebarPay() {    
    this.openOrderFood.emit(true) ;
  }

  onLogoClick() {
    // document.body.style.overflowY = 'auto';
  }
}
