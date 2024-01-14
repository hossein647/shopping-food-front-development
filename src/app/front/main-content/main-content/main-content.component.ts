import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShopCategoryService } from '../../_services/shop-category.service';
import { ShopCategory } from '../../_interfaces/shop-category.interface'
import { Upload } from 'src/app/__dashboard/upload/state/upload/upload.model';
import { User } from 'src/app/auth/state/user.model';
import { GlobalService } from 'src/app/state/global.service';


@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {

  lists : ShopCategory[];
  images: Upload[] = [];
  users : User[];
  categoryName: string;
  uploadCenter: string = '';
  
  constructor(
    private router: Router,
    private shopCategoryService: ShopCategoryService,
    private golbalService: GlobalService,
  ) {
    this.golbalService.getSetting().subscribe({
      next: (res: any) => { 
        if (res?.setting?.uploadCenter) {
          this.uploadCenter = res.setting.uploadCenter;
          this.getShopCategory();
        }       
      }
    })
  }

  ngOnInit(): void {
  }

  goToPage(category: { alias: string, name: string }) {
    window.localStorage.setItem('onc', JSON.stringify(category));
    this.router.navigate([`shops/${category.alias}`]);
  }


  getShopCategory() {
    this.shopCategoryService.getAll(this.uploadCenter).subscribe(
      res => {
        if (res) {          
          this.lists = res.shopCategories;
        }            
      })
  }

}
