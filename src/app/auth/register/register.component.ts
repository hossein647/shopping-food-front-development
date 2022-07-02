import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  show: boolean;

  constructor(
    private location: Location
  ) { }

  ngOnInit(): void {
    this.show = false;
  }

  back() {
    this.location.back();
  }

}
