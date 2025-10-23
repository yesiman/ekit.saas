import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ApisService } from 'app/shared/services/_ekit/apis.service';
import { GlobalService } from 'app/shared/services/_ekit/global.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';

@Component({
  selector: 'app-action-cell-renderer',
  imports: [
    MatIconModule
  ],
  template: `
    <div class="action-buttons">
      <mat-icon (click)="onEdit()"  color="primary" role="img" title="Editer un projet" class="mat-icon notranslate material-icons mat-ligature-font" aria-hidden="true" data-mat-icon-type="font">edit</mat-icon>
      @if (!globalService.table) {
        <mat-icon (click)="onList()" color="accent" role="img" title="Afficher les lignes" class="mat-icon notranslate material-icons mat-ligature-font" aria-hidden="true" data-mat-icon-type="font">list</mat-icon>
      }
      <mat-icon (click)="onDelete()" color="warn" role="img" title="Editer un projet" class="mat-icon notranslate material-icons mat-ligature-font" aria-hidden="true" data-mat-icon-type="font">delete</mat-icon>
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
  private router = inject(Router);
  params!: ICellRendererParams & {
    onEdit?: (row: any) => void;
    onDelete?: (row: any) => void;
  };

  constructor(public globalService:GlobalService,private confirmService:AppConfirmService) {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    return true;
  }

  onList() {
    this.router.navigate(["/ekit/tables/"+this.globalService.project._id+"/"+this.params.data._id]);
  }

  onEdit() {
    if (this.globalService.table) {
      this.params?.onEdit?.(this.params.data.objectid);
    }
    else {
      this.params?.onEdit?.(this.params.data._id);
    }
    
  }

  onDelete() {
    this.confirmService.confirm({title: "Validation", message: "Désafecter l'objet ?", confirmText: "Valider"})
      .subscribe((result) => {
        if (result) {
          if (this.globalService.table) {
            this.params?.onDelete?.(this.params.data.objectid);
          }
          else {
            this.params?.onDelete?.(this.params.data._id);
          }
        }
      });
    
  }
}