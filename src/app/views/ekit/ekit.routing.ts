import { Routes } from '@angular/router';
import { TablesComponent } from './tables/tables.component';



export const EkitRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'tables',
        component: TablesComponent,
        data: { title: 'Tables', breadcrumb: 'Tables' }
      },
    ]
  }
];