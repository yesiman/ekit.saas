import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { ICellRendererParams } from 'ag-grid-community';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'editable-relation-cell',
  imports: [
    FormsModule,
    CommonModule
  ],
  template: `
    <div class="flex gap-1 overflow-x-auto whitespace-nowrap">
      <span *ngFor="let tag of tags"
            class="inline-block tag">
        {{ tag }}
      </span>
    </div>
  `,
  
})
export class EditableRelationCell implements ICellRendererAngularComp {
  public tags: string[] = [];

  agInit(params: any): void {
    // params.value peut être une string[] ou une string séparée par des virgules
    this.tags = Array.isArray(params.value) ? params.value : (params.value ?? '').split(',');
  }

  refresh(params: any): boolean {
    this.agInit(params);
    return true;
  }

  
}