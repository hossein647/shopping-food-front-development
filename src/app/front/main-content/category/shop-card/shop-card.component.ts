import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RatingService } from 'src/app/front/_services/rating.service';
import { ShopCategoryService } from 'src/app/front/_services/shop-category.service';
import { ShopsService } from 'src/app/front/_services/shops.service';
import { Shop } from 'src/app/_user-profile/shops/state/shop/shop.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-shop-card',
  templateUrl: './shop-card.component.html',
  styleUrls: ['./shop-card.component.scss']
})
export class CardShopComponent implements OnInit {

  @Input() shops: Shop[];
  @Input() rates: number[];
  @Input() message: string;
  baseApi: string = environment.url;

  constructor(
    private activatedRoute: ActivatedRoute,
    private ratingservice: RatingService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  onClickDetails(shop: Shop) {
    this.router.navigate([shop._id], { relativeTo: this.activatedRoute })
  }

}
