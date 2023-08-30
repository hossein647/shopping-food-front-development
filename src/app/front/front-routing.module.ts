import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MainContentComponent } from './main-content/main-content/main-content.component';
import { WrapperComponent } from './main-content/category/wrapper/wrapper.component';
import { ShopComponent } from './main-content/category/shop/shop.component';
import { ShopsComponent } from './main-content/category/shops/shops.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: '', component: MainContentComponent },
      {
        path: 'shops/:shop-category', component: WrapperComponent,
        children: [
          { path: '', component: ShopsComponent },
          { path: ':id', component: ShopComponent }
        ]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontRoutingModule { }




// const routes: Routes = [
//   {
//     path: '', component: HomeComponent,
//     children: [
//       { path: '', component: MainContentComponent },
//       {
//         path: 'shops/:shop-category', component: WrapperComponent,
//         children: [
//           { path: '', component: ShopsComponent },
//           { path: ':id', component: ShopComponent }
//         ]
//       },
//     ]
//   },
// ];