import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { UntypedFormGroup, UntypedFormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

import datatypes from 'assets/ressources/datatypes.json'
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { Field } from 'app/shared/models/_ekit/field.model';
import { Iobject } from 'app/shared/models/_ekit/iobject.model';
import { GenericFormField } from '../../../models/genericFormField.model';

@Component({
  selector: 'app-generic',
  imports: [
      CommonModule,
      MatInputModule,
      MatListModule,
      MatCardModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatProgressBarModule,
      MatOptionModule,
      MatRadioModule,
      MatCheckboxModule,
      MatButtonModule,
      MatIconModule,
      MatStepperModule,
      ReactiveFormsModule,
      MatDialogModule,
      MatSelectModule,
    ],
  templateUrl: './generic.component.html',
  styleUrl: './generic.component.scss'
})
export class GenericComponent {
  formData = {}
  basicForm: UntypedFormGroup;
  datatypes;
  dynamicsComponents;
  _field:Field;
  constructor(private dialogRef: MatDialogRef<GenericComponent, { saved: boolean; value?: Iobject }>,
    @Inject(MAT_DIALOG_DATA) public data: { value?: Iobject, fields:any }
  ) {
    console.log(data);
    this.datatypes = datatypes;
  }
  ngOnInit() { 
    //INIT PROJECT FORM
    this._field = new Field();

    this.dynamicsComponents = [
      new GenericFormField({
        _id:"plib",
        type:"1",
        body:{},
        controlName:"title",
        placeholder:"Title (Min Length: 4, Max Length: 100)",
        model:this._field.body.plib,
        required:true,
        minLength:-1,
        maxLength:-1
      }),
      new GenericFormField({
        _id:"pli",
        type:"2",
        body:{},
        controlName:"title2",
        placeholder:"title2 (Min Length: 4, Max Length: 100)",
        model:this._field.body.pli,
        required:true,
        minLength:-1,
        maxLength:-1
      }),
      new GenericFormField({
        _id:"pl",
        type:"3",
        body:{},
        controlName:"title3",
        placeholder:"title3 (Min Length: 4, Max Length: 100)",
        model:this._field.body.pl,
        required:true,
        datasource:this.datatypes,
        minLength:-1,
        maxLength:-1
      })];
    //
    let formGroupControls = {};
    this.dynamicsComponents.forEach(element => {
      let validatorsArray = [];
      if (element.required) { validatorsArray.push(Validators.required) };
      if (element.minLength) { validatorsArray.push(Validators.minLength(4)) };
      if (element.maxLength) { validatorsArray.push(Validators.maxLength(100)) };
      formGroupControls[element.controlName] = new UntypedFormControl('', validatorsArray);
    });
    this.basicForm = new UntypedFormGroup(formGroupControls);

    /*this.basicForm = new UntypedFormGroup({
      title: new UntypedFormControl('', [
        Validators.minLength(4),
        Validators.maxLength(100)
      ]),
      description: new UntypedFormControl('', [
        Validators.required
      ]),
      ptype: new UntypedFormControl('', [
        Validators.required
      ])
    })*/
  }
  submit() {
    console.log(this._field);
  }
  cancel() {
    this.dialogRef.close({ saved: false });
  }
}
