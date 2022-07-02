import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShopCategory } from 'src/app/front/_interfaces/shop-category.interface';
import { RatingService } from 'src/app/front/_services/rating.service';
import { ShopsService } from 'src/app/front/_services/shops.service';
import { Shop } from 'src/app/_user-profile/shops/state/shop/shop.model';

@Component({
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.scss']
})
export class ShopsComponent implements OnInit {

  shops       : Shop[] = [];
  totalPages  : number[] = [];
  paginate    : any;
  rates       : number[] = [];
  ratesHelper : number[] = [];
  categoryName: string;
  message     : string;

  constructor(
    private shopService  : ShopsService,
    private ratingService: RatingService,
    private router       : Router,
  ) { }

  ngOnInit(): void {
    this.getShops();
    
    if (this.shops.length === 0) {
      const category = JSON.parse(window.localStorage.getItem('onc') || '');      
      this.shopService.setShops(category.name, 6, 0);
    }
  }

  getShops() {
    this.shopService.getShops().subscribe(
      res => {        
        if (res?.shops?.docs) {
          this.shops = res.shops?.docs;
          this.paginate = res;
          this.totalPages = [];
          this.ratesHelper = [];
          this.rates = [];
          
          for (let i = 0; i < res.shops?.docs.length; i++) {
            this.categoryName = this.shops[0].category;            
            this.getShopRate(this.shops[i].name);
          }

          for (let i = 0; i < res.shops?.totalPages; i++) {
            this.totalPages.push(i + 1);
          }
        } else {
          if (res) {
            this.shops = [];
            this.totalPages = [];            
            this.message = res?.message || 'رستورانی وجود ندارد';
          }
        }
      }
    )
  }

  changePagination(page: number) {
    if (page === -1 && this.paginate.shops.hasPrevPage) {
      this.paginate.shops.page -= 1;
      this.shopService.setShops(this.categoryName, 6, this.paginate.shops.page)
    }
    if (page === +1 && this.paginate.shops.hasNextPage) {
      this.paginate.shops.page += 1;
      this.shopService.setShops(this.categoryName, 6, this.paginate.shops.page)
    }
    this.ratesHelper = [];
  }


  getShopRate(shopName: string) {
    this.ratingService.shopRating(shopName).subscribe(
      res => {
        if (res) {          
          this.ratesHelper.push(res.rateShop);
          this.rates = this.ratesHelper;          
        }
      }
    )
  }


  selectCategory(category: ShopCategory) {    
    this.router.navigate([`shops/${category.alias}`])
    window.localStorage.setItem('onc', JSON.stringify(category));
    this.shopService.setShops(category.name, 6, 0);
  }



  getShopsFromSidebarFilter(data: any) {
    this.shopService.getAllByCategoryAndDescription(data.category, data.subFoodSelected, 6, 0)
      .subscribe(
        res => {
          if (res) {            
            this.shopService.setSubFoodCategory(res);
          }
        }
      )
  }


  changePage(page: number) {
    this.shopService.setShops(this.categoryName, 6, page)
  }
}
