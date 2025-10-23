import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { IInnerHeaderAngularComp } from 'ag-grid-angular';
import type { IHeaderParams } from 'ag-grid-community';
import { Field } from 'app/shared/models/_ekit/field.model';
import { GlobalService } from 'app/shared/services/_ekit/global.service';

export interface ICustomInnerHeaderParams {
    icon: string;
}

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,

    template: `
        <div class="customInnerHeader">
            <span>{{ displayName() }}</span>

            @if (icon()) {
                <mat-icon matRipple (click)="onEdit($event)" role="img" title="Editer un projet" class="editIcon mat-icon notranslate material-icons mat-ligature-font" aria-hidden="true" data-mat-icon-type="font">{{ icon() }}</mat-icon>
            }
            @if (params.field.multiling) {
                <mat-icon matRipple (click)="onEdit($event)" role="img" title="Champ multilmingue" class="multilingIcon mat-icon notranslate material-icons mat-ligature-font" aria-hidden="true" data-mat-icon-type="font">flag</mat-icon>
            }
            @if (params.field && params.field.specifics && params.field.specifics[globalService.project._id+globalService.table._id] && params.field.specifics[globalService.project._id+globalService.table._id].required) {
                <mat-icon matRipple (click)="onEdit($event)" role="img" title="Obligatoire" class="requiredIcon mat-icon notranslate material-icons mat-ligature-font" aria-hidden="true" data-mat-icon-type="font">emergency</mat-icon>
            }
            
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
              opacity:0.7;
              width:16px;
            }
            
            .editIcon { color:orange; }
            .multilingIcon { color:green; }
            .requiredIcon { color:red; }

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
    params!: IHeaderParams & { onAddColumn?: (uid?:string) => void; field?: Field; };
    icon = signal('');
    displayName = signal('');

    constructor(public globalService:GlobalService) {}

    agInit(params: IHeaderParams & ICustomInnerHeaderParams): void {
        //console.log("params",params);
        this.icon.set(params.icon);
        this.displayName.set(params.displayName);
        console.log(params);
        this.params = params;
    }

    onEdit(e: Event) {
        e.preventDefault();
        e.stopPropagation();
        //console.log
        this.params?.onAddColumn?.(this.params.field._id);
    }

    refresh(params: IHeaderParams): boolean {
        return false;
    }
}