// add-header-button.component.ts
import { Component } from '@angular/core';
import { IHeaderAngularComp } from 'ag-grid-angular';
import { IHeaderParams } from 'ag-grid-community';

@Component({
  selector: 'app-add-header-button',
  template: `
    <button
      type="button"
      class="ag-header-btn"
      (click)="handleClick()"
      [attr.aria-label]="params?.title || 'Ajouter une colonne'"
      title="{{ params?.title || 'Ajouter une colonne' }}"
    >+</button>
  `,
  styles: [`
    :host {
      display: flex;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
    }
    .ag-header-btn {
      line-height: 1;
      font-size: 16px;
      width: 28px;
      height: 28px;
      border: 1px solid transparent;
      border-radius: 6px;
      background: transparent;
      cursor: pointer;
    }
    .ag-header-btn:hover { border-color: rgba(0,0,0,0.25); }
  `]
})
export class AddHeaderButtonComponent implements IHeaderAngularComp {
  params!: IHeaderParams & { onAddColumn?: (uid?:string) => void; title?: string };

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  handleClick(): void {
    this.params?.onAddColumn?.();
  }
}
