import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @Input() show: boolean;

  constructor(
    private location: Location
  ) { }

  ngOnInit(): void {
    this.show = true;
  }

  back() {
    this.location.back();
  }

}
