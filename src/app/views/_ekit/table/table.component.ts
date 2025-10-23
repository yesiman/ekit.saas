import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Field } from 'app/shared/models/_ekit/field.model';
import { Table } from 'app/shared/models/_ekit/table.model';
import { ApisService } from 'app/shared/services/_ekit/apis.service';
import { GlobalService } from 'app/shared/services/_ekit/global.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  standalone:false
})
export class TableComponent {
  private route = inject(ActivatedRoute);
  formData = {}
  console = console;
  basicForm: UntypedFormGroup;
  //
  _table:Table;
  datatypes;

  constructor(private apisService:ApisService, public globalService:GlobalService) { }

  initializeDataComp() {
    //INIT LANGUAGE TABLE
    //INIT PROJECT FORM
    this.basicForm = new UntypedFormGroup({
      title: new UntypedFormControl('', [
        Validators.minLength(4),
        Validators.maxLength(100)
      ]),
      description: new UntypedFormControl('', [
        Validators.required
      ])
    })
  }

  ngOnInit() {
      //SI ID == -1
      this.route.params.subscribe(routeParams => {
        if (routeParams.tableuid == "-1") {
          this._table = new Table();
          this._table._id = "-1";
          this._table.projects.push(this.globalService.project._id);
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
    //return;
    this.apisService.save(this._table,"prototypes",this.globalService.appLang()).subscribe((data) => {
      this.console.log("data",data);
    });
  }
}
