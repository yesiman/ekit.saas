import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { UntypedFormGroup, UntypedFormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
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
import { ApisService } from 'app/shared/services/_ekit/apis.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { GlobalService } from 'app/shared/services/_ekit/global.service';

@Component({
  selector: 'app-generic',
  standalone: true,
  imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      MatInputModule,
      MatListModule,
      MatCardModule,
      MatGridListModule,
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
  _entity:any;
  _type:string;
  fields:GenericFormField[];
  //
  constructor(public globalService:GlobalService, private dialogRef: MatDialogRef<GenericComponent, { saved: boolean; value?: any }>,
    @Inject(MAT_DIALOG_DATA) public data: { value?: any, fields:any, type:string },
    private apisService:ApisService) {
    this._entity =data.value;
    this.fields = data.fields;
    this.datatypes = datatypes;
    this._type = data.type;
  }
  ngOnInit() { 
    //INIT PROJECT FORM
    let formGroupControls = {};
    this.fields.forEach(element => {
      let validatorsArray = [];
      if (element.required==true) { validatorsArray.push(Validators.required) };
      if (element.minLength) { validatorsArray.push(Validators.minLength(4)) };
      if (element.maxLength) { validatorsArray.push(Validators.maxLength(100)) };
      formGroupControls[element._id] = new UntypedFormControl('', validatorsArray);
    });
    this.basicForm = new UntypedFormGroup(formGroupControls);
  }
  isVisible(visibleClause) {
    if (visibleClause) {
      return (visibleClause.indexOf(this._entity.body.ptype)>-1);
    }else {
      return true;
    }
    
  }
  submit() {
    this.apisService.save(this._entity,this._type,"fr").subscribe((data) => {
      this.dialogRef.close({ saved: true });
    });
  }
  cancel() {
    this.dialogRef.close({ saved: false });
  }
}
