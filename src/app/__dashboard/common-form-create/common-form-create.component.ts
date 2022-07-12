import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-common-form-create',
  templateUrl: './common-form-create.component.html',
  styleUrls: ['./common-form-create.component.scss']
})
export class CommonFormCreateComponent implements OnInit {

  @Input() placeholder: string = '';
  @Input() titleForm: string = '';
  @Input() buttonTextInner: string = '';
  @Input() btnType: string = '';
  @Input() formWidth: any;

  constructor() { }

  ngOnInit(): void {}

}
