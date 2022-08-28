import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-not-login-model',
  templateUrl: './not-login-model.component.html',
  styleUrls: ['./not-login-model.component.scss']
})
export class NotLoginModelComponent implements OnInit {


  @Input() message: string;
  @Input() show: boolean;
  @Output() onModal = new EventEmitter<ElementRef>();
  @ViewChild('modal') modal: ElementRef;

  constructor(
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {}



  closeNoLoginModal() {    
    this.onModal.emit();
  }
}
