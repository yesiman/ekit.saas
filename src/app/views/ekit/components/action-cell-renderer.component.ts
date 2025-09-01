import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-action-cell-renderer',
  imports: [
    MatIconModule
  ],
  template: `
    <div class="action-buttons">
      <mat-icon (click)="onEdit()" role="img" title="Editer un projet" class="mat-icon notranslate material-icons mat-ligature-font" aria-hidden="true" data-mat-icon-type="font">edit</mat-icon>
      <mat-icon (click)="onList()" role="img" title="Editer un projet" class="mat-icon notranslate material-icons mat-ligature-font" aria-hidden="true" data-mat-icon-type="font">list</mat-icon>
      <mat-icon (click)="onDelete()" role="img" title="Editer un projet" class="mat-icon notranslate material-icons mat-ligature-font" aria-hidden="true" data-mat-icon-type="font">delete</mat-icon>
    </div>
  `,
  styles: [`
    .action-buttons {
      display: flex;
      justify-content: center;
      gap: 0px;
    }
    mat-icon {
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width:20px;

      font-size: 16px;
      transition: transform 0.2s;
    }
    mat-icon:hover { transform: scale(1.2); }
  `]
})
export class ActionCellRendererComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    return true;
  }

  onList() {
    alert(`Lister: ${this.params.data._id}`);
  }

  onEdit() {
    alert(`Éditer: ${this.params.data._id}`);
  }

  onDelete() {
    alert(`Supprimer: ${this.params.data._id}`);
  }
}