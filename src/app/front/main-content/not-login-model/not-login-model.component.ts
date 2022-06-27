import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-not-login-model',
  templateUrl: './not-login-model.component.html',
  styleUrls: ['./not-login-model.component.scss']
})
export class NotLoginModelComponent implements OnInit {


  @Input() message: string;
  @Input() show: boolean;
  @Output() onModal = new EventEmitter<ElementRef>();

  constructor() { }

  ngOnInit(): void {}



  closeNoLoginModal() {    
    this.onModal.emit();
  }

}
