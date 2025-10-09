import { Component } from '@angular/core';
import { IHeaderAngularComp } from 'ag-grid-angular';
import { IHeaderParams } from 'ag-grid-community';

@Component({
  selector: 'app-prototype-col-header',
  template: `
    <div class="my-hd" (click)="sort($event)">
      <span class="ag-header-cell-text">{{ params.displayName }}</span>
      <span class="ag-header-icon ag-header-icon-filter"
            
            (click)="openMenu($event)">
        <span class="ag-icon ag-icon-filter"></span>
      </span>
      <button class="icon-btn" (click)="onIcon($event)" title="kml">
        <span class="material-icons">add</span>
      </button>
      <span class="ag-header-icon ag-header-menu-button" (click)="openMenu($event)"></span>
    </div>
  `,
  styles: [`
    .my-hd { display:inline-flex; align-items:center; gap:6px; }
    .icon-btn { border:0; background:transparent; padding:0; line-height:1; cursor:pointer; }
    .material-icons { font-size:16px; }
  `]
})
export class PrototypeColHeader implements IHeaderAngularComp {
  params!: IHeaderParams;
  agInit(p: IHeaderParams) { this.params = p; }
  refresh(p: IHeaderParams) { this.params = p; return true; }
  sort(e: MouseEvent) { if (this.params.enableSorting) this.params.progressSort(e.shiftKey); }
  openMenu(e: MouseEvent) { e.stopPropagation(); this.params.showColumnMenu!(e.target as HTMLElement); }
  onIcon(e: MouseEvent) { e.stopPropagation(); /* ta logique */ }
}