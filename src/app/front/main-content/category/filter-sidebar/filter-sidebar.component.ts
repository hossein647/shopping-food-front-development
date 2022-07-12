import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ShopCategory } from 'src/app/front/_interfaces/shop-category.interface';
import { FoodCategoryService } from 'src/app/front/_services/food-category.service';
import { ShopCategoryService } from 'src/app/front/_services/shop-category.service';
import { SubFood } from 'src/app/__dashboard/sub-category-food/state/sub-food.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-filter-sidebar',
  templateUrl: './filter-sidebar.component.html',
  styleUrls: ['./filter-sidebar.component.scss']
})
export class FilterSidebarComponent implements OnInit {

  categories: ShopCategory[] = [];
  subFoodCategories: SubFood[];
  selected: string;
  @Output() onSelectCategory = new EventEmitter<ShopCategory>();
  @Output() filterShops = new EventEmitter<any>();
  subSelected: string;
  nameCategory: string;
  baseApi: string = environment.url;

  constructor(
    private shopCategoryService: ShopCategoryService,
    private activatedRoute: ActivatedRoute,
    private foodCategoryService: FoodCategoryService,
  ) { }

  ngOnInit(): void {
    this.getShopCategory();
  }
  
  
  getShopCategory() {
    this.activatedRoute.paramMap.subscribe(
      (param: ParamMap) => {
        if (param.has('shop-category')) {
          this.shopCategoryService.getAll().subscribe(
            res => {              
              if (res) {
                const categoryName = param.get('shop-category')
                this.categories = res.shopCategories;  
                
                const shopCategories = this.categories.filter(
                  (shopCategory: ShopCategory) => shopCategory.alias === categoryName
                );
                this.selected = shopCategories[0]?.alias;
                this.nameCategory = shopCategories[0]?.name;
                this.getSubFoodCategory(this.categories, this.selected)
              }
            }
          )
        }        
      }
    )
  }



  clickSelectCategory(category: ShopCategory) {
    this.onSelectCategory.emit(category);
    this.selected = category.alias;
    this.nameCategory = category.name;
    this.subSelected = '';
    this.getSubFoodCategory(this.categories, category.alias);
  }


  getSubFoodCategory(shopCategories: ShopCategory[], categorySelected: string) {
    const shopCategory = shopCategories.filter(shopCategory => shopCategory.alias === categorySelected)
    this.foodCategoryService.getAllByShopCategory(shopCategory[0].name).subscribe(
      res => {
        if (res) {
          this.subFoodCategories = res.foodCategories;          
        }
      }
    )
  }


  selectSubFoodCategory(event: any, subFoodSelected: string, category: string) {
    this.subSelected = subFoodSelected;
    this.selected = '';
    event.stopPropagation();
    this.filterShops.emit({ subFoodSelected, category });
  }

}
