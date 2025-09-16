import { Routes } from '@angular/router';
import { TablesComponent } from './generics_tables/tables.component';
import { ProjectComponent } from './project/project.component';



export const EkitRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'project/:projectuid',
        component: ProjectComponent,
        data: { title: 'Tables', breadcrumb: 'Tables' }
      },
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