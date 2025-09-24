import { Component, inject, OnInit } from '@angular/core';
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
import { LocalStoreService } from 'app/shared/services/local-store.service';
import { ActivatedRoute } from '@angular/router';
import { ApisService } from 'app/shared/services/_ekit/apis.service';
import { Project } from 'app/shared/models/_ekit/product.model';

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
  private route = inject(ActivatedRoute);
  formData = {}
  console = console;
  basicForm: UntypedFormGroup;
  //
  _project:Project;

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
  projectUID:string = "-1";
  constructor(private ls:LocalStoreService,private apisService:ApisService) { }
  
  isLangSelected(langCode:string):boolean {
    const findResult = this._project.langs.find(lang => { return (lang == langCode)});
    if (findResult) {
      return (findResult.length>0);
    }
    else {
      return false;
    }
  }

  initializeDataComp() {
    //INIT LANGUAGE TABLE
    this.rowData = langs.map(lang => {
      return {
        actif:this.isLangSelected(lang.code),
        ...lang
      }
    });
    //INIT PROJECT FORM
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

  ngOnInit() {
    //SI ID == -1
    this.route.params.subscribe(routeParams => {
      if (routeParams.projectuid == "-1") {
        this._project = new Project();
        this.projectUID = "-1";
        this.console.log(this._project);
        this.initializeDataComp();
      } else {
        this.projectUID = routeParams.projectuid;
        this.apisService.getProject(this.projectUID).subscribe((data:any) => {
          this._project = data.result;
          //this.console.log(this._project);
          this.initializeDataComp();
        })
      }
    });
    
    
  }
  valid() {
    const selectedLangs = this.rowData.filter(row => row.actif );
    this._project._id = this.projectUID;
    this._project.langs = selectedLangs.map(row => { return row.code } );
    this.console.log("data",this._project);    
    this.apisService.saveProject(this._project).subscribe((data) => {
      this.console.log("data",data);
    });
  }
}