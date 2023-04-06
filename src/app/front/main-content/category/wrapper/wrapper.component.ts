import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';


@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss']
})
export class WrapperComponent implements OnInit {


  constructor(
    private router: Router
  ) { 
    this.router.events.subscribe(route => {
      if (route instanceof NavigationEnd) {
        console.log(route.url);
  
      }
    })

  }

  ngOnInit(): void {
  }

}
