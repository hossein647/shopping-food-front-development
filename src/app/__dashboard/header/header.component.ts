import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input()  email    : string;
  @Output() onToggle = new EventEmitter();
  @Output() onlogout = new EventEmitter();
  
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  toggleSideNav() {
    this.onToggle.emit();
  }


  home() {
    this.router.navigate(['/']);
   }


  logout() {
    this.onlogout.emit();
  }

}
