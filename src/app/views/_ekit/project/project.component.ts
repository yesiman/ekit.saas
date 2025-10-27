import { Component, inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { themeBalham, type ColDef } from 'ag-grid-community';
import langs from 'assets/ressources/langs.json'
import { ActivatedRoute } from '@angular/router';
import { ApisService } from 'app/shared/services/_ekit/apis.service';
import { Project } from 'app/shared/models/_ekit/project.model';
import { GlobalService } from 'app/shared/services/_ekit/global.service';

@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.scss'],
    standalone:false
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
        width: 60,
        sort: 'desc',
        pinned: 'left'},
      {
        headerName: 'Défaut',
        field: 'defaultLang',
        width: 60,
        pinned: 'left',
        cellRenderer: (params) => {
          const input = document.createElement('input');
          input.type = 'radio';
          input.name = 'defaultRow'; // même nom pour tous les inputs => exclusif
          input.checked = !!params.value;

          // Quand on clique : mettre à jour toutes les lignes
          input.addEventListener('change', () => {
            const api = params.api;

            api.forEachNode((node) => {
              node.setDataValue('defaultLang', node.id === params.node.id);
            });
          });

          return input;
        },
      },
      { field: "code",filter: "agTextColumnFilter" },
      { field: "name",filter: "agTextColumnFilter" },
      { field: "Drapeau" },
  ];
  rowData=[];
  agGridTheme = themeBalham.withParams({fontFamily: 'Poppins',});

  constructor(private apisService:ApisService,private globalService:GlobalService) { }
  
  isLangSelected(langCode:string):boolean {
    const findResult = this._project.langs.find(lang => { return (lang == langCode)});
    if (findResult) {
      return (findResult.length>0);
    }
    else {
      return false;
    }
  }

  isLangDef(langCode:string):boolean {
    return (this._project.defaultLang == langCode);
  }

  initializeDataComp() {
    //INIT LANGUAGE TABLE
    this.rowData = langs.map(lang => {
      return {
        actif:this.isLangSelected(lang.code),
        defaultLang:this.isLangDef(lang.code),
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
/**
 * 
 */
  ngOnInit() {
    //SI ID == -1
    this.route.params.subscribe(routeParams => {
      if (routeParams.projectuid == "-1") {
        this._project = new Project();
        this._project._id = "-1";
        this.initializeDataComp();
      } else {
        this.apisService.getProject(routeParams.projectuid,this.globalService.appLang()).subscribe((data:any) => {
          this._project = data.result;
          this.initializeDataComp();
        })
      }
    });
    
    
  }
  /**
   * 
   */
  valid() {
    // FILTER ON CHECKED AND GET LANG CODES
    this._project.langs = this.rowData.filter(row => row.actif ).map(row => { return row.code } );
    const lang = this.rowData.find(row => (row.defaultLang == true));
    this._project.defaultLang = lang.code;
    this.apisService.save(this._project,"projects",this.globalService.appLang()).subscribe((data) => {

    });
  }
}