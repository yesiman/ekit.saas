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

  rowData = [
        { make: "Tesla", model: "Model Y", price: 64950, electric: true },
        { make: "Ford", model: "F-Series", price: 33850, electric: false },
        { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    ];

    // Column Definitions: Defines the columns to be displayed.
    colDefs: ColDef[] = [
        { field: "make" },
        { field: "model", type:boolean },
        { field: "price" },
        { field: "electric" }
    ];

    agGridTheme = themeBalham;
  constructor() { }
  
  ngOnInit() {
    let password = new UntypedFormControl('', Validators.required);
    let confirmPassword = new UntypedFormControl('');

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