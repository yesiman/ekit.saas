import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UntypedFormGroup, UntypedFormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule as MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule as MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule as MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule as MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule as MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import { AgGridAngular } from 'ag-grid-angular';
import { themeBalham, type ColDef, type GridReadyEvent } from 'ag-grid-community';
import langs from 'assets/ressources/langs.json'

@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.scss'],
    imports: [
      CommonModule,
      MatInputModule,
      MatListModule,
      MatCardModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatProgressBarModule,
      MatRadioModule,
      MatCheckboxModule,
      MatButtonModule,
      MatIconModule,
      MatStepperModule,
      ReactiveFormsModule,
      AgGridAngular
    ],
    standalone:true
})
export class ProjectComponent implements OnInit {
  formData = {}
  console = console;
  basicForm: UntypedFormGroup;

    // Column Definitions: Defines the columns to be displayed.
    colDefs: ColDef[] = [
        { field: "actif", type:"boolean",filter: "agTextColumnFilter",
          sortable: true,editable:true,
          pinned: 'left'},
        { field: "code",filter: "agTextColumnFilter" },
        { field: "name",filter: "agTextColumnFilter" },
        { field: "Drapeau" }
    ];
    rowData=[];
    agGridTheme = themeBalham;
  constructor() { }
  
  ngOnInit() {
    //this.rowData = langs.default;
    
    this.rowData = langs.map(lang => {
      return {
        actif:false,
        ...lang
      }
    });
    this.basicForm = new UntypedFormGroup({
      title: new UntypedFormControl('', [
        Validators.minLength(4),
        Validators.maxLength(100)
      ]),
      description: new UntypedFormControl('', [
        Validators.required
      ]),
      website: new UntypedFormControl(''),
      date: new UntypedFormControl(),
    })
  }
}