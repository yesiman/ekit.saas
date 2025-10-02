import { Routes } from '@angular/router';
import { TablesComponent } from './generics_tables/tables.component';
import { ProjectComponent } from './project/project.component';
import { PropertieComponent } from './propertie/propertie.component';
import { TableComponent } from './table/table.component';



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
      {
        path: 'project/:projectuid',
        loadChildren: () => import('./project/project.module').then(m => m.ProjectModule),
        data: { title: 'Tables', breadcrumb: 'Tables' }
      },
      {
        path: 'table/:tableuid',
        loadChildren: () => import('./table/table.module').then(m => m.TableModule),
        data: { title: 'Propertie', breadcrumb: 'Propertie' }
      },
      {
        path: 'field/:fielduid',
        loadChildren: () => import('./propertie/propertie.module').then(m => m.PropertieModule),
        data: { title: 'Propertie', breadcrumb: 'Propertie' }
      },
    ]
  }
];