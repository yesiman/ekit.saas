import { Routes } from '@angular/router';

import { AppPricingComponent } from './app-pricing/app-pricing.component';

export const OthersRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'pricing',
      component: AppPricingComponent,
      data: { title: 'Pricing', breadcrumb: 'PRICINGS' }
    }]
  }
];