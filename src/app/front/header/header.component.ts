import {  ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { GlobalQuery } from 'src/app/state/global.query';
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
   
  @ViewChild('lists') lists: ElementRef;
  @Input() orderFoodLength: number;
  @Input() sidebarShow    : boolean;
  @Input() scrolled       : boolean;
   
  constructor(
    private globalService: GlobalService,
    private globalQuery: GlobalQuery,
    private cdRef: ChangeDetectorRef  
  ) {}

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

  ngOnInit(): void {
    document.body.style.overflowY = 'auto';
  }


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
    document.body.style.overflowY = 'auto';
  }

}