import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Upload } from 'src/app/__dashboard/upload/state/upload/upload.model';
import { environment } from 'src/environments/environment';
import { ShopCategory } from '../../_interfaces/shop-category.interface';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  @Input() lists: ShopCategory[];
  @Input() images: Upload[];
  @Input() uploadCenter: string;
  @Output() onGoToPage = new EventEmitter<{alias: string, name: string}>();
  baseApi: string = environment.url;

  constructor() { }

  ngOnInit(): void {

    
  }

  goToPage(alias: string, name: string) {
    this.onGoToPage.emit({ alias, name })    
  }

}
