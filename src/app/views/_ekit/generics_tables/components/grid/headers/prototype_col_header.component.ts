import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { IInnerHeaderAngularComp } from 'ag-grid-angular';
import type { IHeaderParams } from 'ag-grid-community';

export interface ICustomInnerHeaderParams {
    icon: string;
}

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,

    template: `
        <div class="customInnerHeader">
            @if (icon()) {
                <mat-icon matRipple (click)="onEdit($event)" role="img" title="Editer un projet" class="mat-icon notranslate material-icons mat-ligature-font" aria-hidden="true" data-mat-icon-type="font">{{ icon() }}</mat-icon>
      
            }
            <span>{{ displayName() }}</span>
        </div>
    `,
    styles: [
        `
            .customInnerHeader {
                display: flex;
                gap: 0.25rem;
                align-items: center;
                
            }

            mat-icon {
              font-size:16px;
              height:16px;
            }

            .customInnerHeader span {
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .fa {
                color: cornflowerblue;
            }
        `,
    ],
})
export class PrototypeColHeader implements IInnerHeaderAngularComp {
    params!: IHeaderParams & { onAddColumn?: (uid?:string) => void; uid?: string };
    icon = signal('');
    displayName = signal('');

    agInit(params: IHeaderParams & ICustomInnerHeaderParams): void {
        this.icon.set(params.icon);
        this.displayName.set(params.displayName);
        console.log(params);
        this.params = params;
    }

    onEdit(e: Event) {
        e.preventDefault();
        e.stopPropagation();
        //console.log
        this.params?.onAddColumn?.(this.params.uid);
    }

    refresh(params: IHeaderParams): boolean {
        return false;
    }
}