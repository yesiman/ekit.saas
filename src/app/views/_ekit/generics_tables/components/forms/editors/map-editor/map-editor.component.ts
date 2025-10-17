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
import { ApisService } from 'app/shared/services/_ekit/apis.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { GlobalService } from 'app/shared/services/_ekit/global.service';
import { QuillModule } from 'ngx-quill';
import { HttpClient, provideHttpClient, withInterceptorsFromDi, withJsonpSupport } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-map-editor',
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
      QuillModule,
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
      GoogleMapsModule
    ], 
  templateUrl: './map-editor.component.html',
  styleUrl: './map-editor.component.scss'
})
export class MapEditorComponent {
  formData = {}
  basicForm: UntypedFormGroup;
  editorData;
  apiLoaded: Observable<boolean>;
  //
  constructor(public globalService:GlobalService, private dialogRef: MatDialogRef<any, { saved: boolean; value?: any }>,
    @Inject(MAT_DIALOG_DATA) public data: { value?:string, objectuid:string },
    private apisService:ApisService,httpClient: HttpClient) {
    this.editorData = data.value;
    try {
      this.apiLoaded = this.apisService.loadGmapLibrary()
        .pipe(
          map(() => true),
          catchError(() => of(false)),
        );
    }
    catch(err) {
      console.log(err);
    }
  }
  ngOnInit() { 
    //INIT PROJECT FORM
    let formGroupControls = {};
    
    //formGroupControls["content"] = new UntypedFormControl('');
    //this.basicForm = new UntypedFormGroup(formGroupControls);
    
  }
  submit() {
    this.dialogRef.close({ saved: true, value:this.editorData });
  }
  cancel() {
    this.dialogRef.close({ saved: false });
  }
}
