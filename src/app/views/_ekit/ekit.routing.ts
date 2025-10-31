import { Routes } from '@angular/router';
import { TablesComponent } from './generics_tables/tables.component';
import { ProjectComponent } from './project/project.component';


export const EkitRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'tables/:projectuid',
        component: TablesComponent,
        data: { title: 'Tables', breadcrumb: 'Tables', type:"tables" }
      },
      {
        path: 'tables/:projectuid/:tableuid',
        component: TablesComponent,
        data: { title: 'Tables', breadcrumb: 'Tables' }
      },
      {
        path: 'templates/:projectuid',
        component: TablesComponent,
        data: { title: 'Tables', breadcrumb: 'Tables', type:"templates" }
      },
      {
        path: 'templates/:projectuid/:templateuid',
        loadChildren: () => import('./template-editor/template-editor.module').then(m => m.TemplateEditorModule),
        data: { title: 'Tables', breadcrumb: 'Tables' }
      },
      {
        path: 'project/:projectuid',
        loadChildren: () => import('./project/project.module').then(m => m.ProjectModule),
        data: { title: 'Tables', breadcrumb: 'Tables' }
      },
      {
        path: 'editor/:projectuid',
        loadChildren: () => import('./template-editor/template-editor.module').then(m => m.TemplateEditorModule),
        data: { title: 'Tables', breadcrumb: 'Tables' }
      },
    ]
  }
];