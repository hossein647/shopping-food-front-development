import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  open?: boolean = true;
  show?: string = '';
  constructor() {}

  ngOnInit(): void {}
  
  
  toggleSidebar() {
    this.open = !this.open;    
  }

  selectedList(key: string) {
    this.show = key;
  }

}
