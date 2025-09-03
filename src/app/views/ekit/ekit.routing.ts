import { Routes } from '@angular/router';
import { TablesComponent } from './tables/tables.component';



export const EkitRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'tables/:projectuid',
        component: TablesComponent,
        data: { title: 'Tables', breadcrumb: 'Tables' }
      },
      {
        path: 'tables/:projectuid/:tableuid',
        component: TablesComponent,
        data: { title: 'Tables', breadcrumb: 'Tables' }
      },
    ]
  }
];