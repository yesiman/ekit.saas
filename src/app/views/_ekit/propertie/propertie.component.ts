import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { Field } from 'app/shared/models/_ekit/field.model';
import { ApisService } from 'app/shared/services/_ekit/apis.service';
import { GlobalService } from 'app/shared/services/_ekit/global.service';
import datatypes from 'assets/ressources/datatypes.json'

@Component({
  selector: 'app-propertie',
  templateUrl: './propertie.component.html',
  styleUrl: './propertie.component.scss',
  standalone:false
})
export class PropertieComponent {
  private route = inject(ActivatedRoute);
  formData = {}
  console = console;
  basicForm: UntypedFormGroup;
  //
  _field:Field;
  datatypes;

  constructor(private globalService:GlobalService, private apisService:ApisService) {

  }

  initializeDataComp() {
    //INIT LANGUAGE TABLE
    this.datatypes = datatypes;
    //INIT PROJECT FORM
    this.basicForm = new UntypedFormGroup({
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
    })
  }

  ngOnInit() {
      //SI ID == -1
      this.route.params.subscribe(routeParams => {
        if (routeParams.fielduid == "-1") {
          this._field = new Field();
          this._field._id = "-1";
          this._field._projprof.push(this.globalService.project._id+this.globalService.table)
          //this.console.log(this._project);
          this.initializeDataComp();
        } else {
          //this.projectUID = routeParams.projectuid;
          //this.apisService.getProject(this.projectUID).subscribe((data:any) => {
            //this._project = data.result;
            //this.console.log(this._project);
            this.initializeDataComp();
          //})
        }
      });
      
      
    }

  valid() {
    this.apisService.save(this._field,"properties","fr").subscribe((data) => {
      this.console.log("data",data);
    });
  }
}
