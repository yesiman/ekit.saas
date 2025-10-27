import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EkitRoutes } from './ekit.routing';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MonacoEditorModule.forRoot({ baseUrl: '/assets/vs' }),
    RouterModule.forChild(EkitRoutes),
  ],
  declarations: [],
})
export class AppEkitModule {}
