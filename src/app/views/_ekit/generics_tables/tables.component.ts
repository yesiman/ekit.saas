import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { ColDef, GridReadyEvent } from 'ag-grid-community';
import { environment } from 'environments/environment';
import { catchError, map, throwError } from 'rxjs';
import { CheckboxCellRenderer, themeBalham } from 'ag-grid-community';
import { ActionCellRendererComponent } from './components/grid/cells/action-cell-renderer.component';
import { EditableTextCellTranslate } from './components/grid/cells/editable-text-cell-translate.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GlobalService } from 'app/shared/services/_ekit/global.service';
import { CommonModule,Location } from '@angular/common';
import { EditableRelationCell } from './components/grid/cells/editable-relation-cell.component copy';
import { FormsModule } from '@angular/forms';
import { ApisService } from 'app/shared/services/_ekit/apis.service';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { AddHeaderButtonComponent } from 'app/views/_ekit/generics_tables/components/grid/headers/add-header-button.component';
import { Field } from 'app/shared/models/_ekit/field.model';
import { util_d$1 } from 'echarts/types/dist/shared';
import { Entity } from 'app/shared/models/_ekit/entity.model';
import { PropertieComponent } from '../propertie/propertie.component';
import { MatDialog } from '@angular/material/dialog';
import { PropertieModule } from '../propertie/propertie.module';
import { GenericComponent } from './components/forms/generic/generic.component';
import { Iobject } from 'app/shared/models/_ekit/iobject.model';
import { GenericFormField } from './models/genericFormField.model';
import datatypes from 'assets/ressources/datatypes.json'
import { Table } from 'app/shared/models/_ekit/table.model';
import { PrototypeColHeader } from './components/grid/headers/prototype_col_header.component';

// Row Data Interface
interface IRow {
  mission: string;
  company: string;
  location: string;
  date: string;
  time: string;
  rocket: string;
  price: number;
  successful: boolean;
}

@Component({
  selector: 'app-tables',
  imports: [
    CommonModule,
    FormsModule,
    AgGridAngular,
    MatIconModule,
    MatMenuModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatInputModule,
    RouterModule
  ],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss',
  standalone: true,
})

export class TablesComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  datatypes;

  gridApi;
  loading = true;
  constructor(
    private http: HttpClient,public globalService:GlobalService,
    private apisServices:ApisService,private _location: Location,
    private dialog:MatDialog
  ) {
    this.datatypes = datatypes;
  }

  ngOnInit() {
    
    this.route.params.subscribe(routeParams => {
      this.loading = true;
      this.rowData = [];
      this.colDefs = [];
      this.globalService.table = null;
      if (routeParams.tableuid) {
        this.apisServices.getTable(routeParams.tableuid,"fr").subscribe((data:any) => {
          console.log(data);
          this.globalService.table = data.result;
          //this.console.log(this._project);
          setTimeout(() => {
            this.loading = false;          // recrée la grille
          });
        })
      }
      else {
        setTimeout(() => {
          this.loading = false;          // recrée la grille
        });
      }
      
      
	  });
  }

  rowData: IRow[] = [];
  colDefs: ColDef[] = [];
  agGridTheme = themeBalham;
  /**
   * 
   */
  navBack() {
    this._location.back();
  }
  /** 
   * LOAD PAGINATING DATAS
   * */ 
  loadPage() {
    
    this.http.post(`${environment.apiURL}/datas/fr`, { projectUID:this.globalService.project._id, tableUID:this.globalService.table._id, coordinates:"Y" })
      .pipe(
        map((res: any) => {
          console.log(res);
          //this.gridApi.setRowCount();
          return res.result.map(item => ({
                ...item.body
            }));
        }),
        catchError((error) => {
          return throwError(error);
        })
    ).subscribe((data) => {

      this.rowData = data;
      setTimeout(() => {
        //const allColumnIds = this.gridApi.getColumns()?.map(col => col.getColId());
        //this.gridApi.autoSizeColumns(allColumnIds);
      });
    })
  }

  /** 
   * MANAGE CELL EDITOR STYLE FROM PROPERTY TYPE
   * */ 
  getCellEditorTemplate(ptype:string) {
    switch (ptype) {
      //SELECT / ENUMS
      case "5912f82d4c3181110079e0a6":
        return 'agSelectCellEditor';
      // TEXTE BASIC
      case "5912f7034c3181110079e09e":
        return EditableTextCellTranslate;
      case "5b33228daf1f20140098fbf8":
        return "agDateCellEditor";
      case "5912f7194c3181110079e09f":
        return "agLargeTextCellEditor";
    }
    //agLargeTextCellEditor",
      //cellEditorPopup: true,
    return null;
  }
  /** 
   * MANAGE CELL ENUMS IDS PARAMS
   * */ 
  getCellEditorTemplateParams(colItem:any,categoriesLines:any[]) {
    //ON TEST LE PTYPE DE L'ELEMENT
    switch (colItem.body.ptype) {
      // LIEN INTERPROFIL
      case "5912f82d4c3181110079e0a6":
        const filteredCategoriesLines = categoriesLines.filter(item => (item.curProto == colItem.config.categid));
        console.log("kkk",Object.fromEntries(filteredCategoriesLines.map(item => [item._id.toString(), item.body.p5b5ea8fd0311784a87b6dc0a])));
        return (filteredCategoriesLines.map(item => {
          return item._id;
         }))
    }
    return null;
  }
  /** 
   * MANAGE CELL ENUMS IDS PARAMS RELATIONS WITH LABELS
   * */ 
  getCellEditorTemplateValueFormater(params:any,colItem:any,categoriesLines:any[]) {
    //ON TEST LE PTYPE DE L'ELEMENT
    switch (colItem.body.ptype) {
      // LIEN INTERPROFIL
      case "5912f82d4c3181110079e0a6":
        const filteredCategoriesLines = categoriesLines.filter(item => (item.curProto == colItem.config.categid));
        const withEmplyVal = filteredCategoriesLines
        const obj = Object.fromEntries(filteredCategoriesLines.map(item => [item._id.toString(), item.body.p5b5ea8fd0311784a87b6dc0a]));
        if (obj)
        {
          const map: Record<string, string> = {"":"",...obj};
          return map[params.value] || params.value;
        }
        else {return null;}
      case "5b33228daf1f20140098fbf8":
        //return new Date(2020);
    }
    return null;
  }
  /** 
   * MANAGE CELL RENDER STYLE FROM PROPERTY TYPE
   * */ 
  getCellRendererTemplate(ptype:string) {
    console.log(ptype);
    switch (ptype) {
      // LIEN INTERPROFIL
      case "5912f8194c3181110079e0a5":
        return EditableRelationCell;
      case "5912f8144c3181110079e0a4":
        return 'agCheckboxCellRenderer';
    }
    return null;
  }
  /** 
   * MANAGE CELL RENDER STYLE FROM PROPERTY TYPE
   * */ 
  getCellType(ptype:string) {
    switch (ptype) {
      case "5912f8144c3181110079e0a4":
        return "boolean";
      case "5b33228daf1f20140098fbf8":
        return "dateTime";
      default:
        return null;
    }
  }
  /**
   * 
   * @param p 
   * @param item 
   * @returns 
   */
  getCellEditorTemplateValueGetter(p,item:any) {
    switch (item.body.ptype) {
      case "5912f8144c3181110079e0a4":
        return (((p.data["p"+item.body.objectid] == true) || (p.data["p"+item.body.objectid] == "true")));
      //case "5b33228daf1f20140098fbf8":
        //return new Date();
      default:
        return p.data["p"+item.body.objectid];
    }
  }

  onPaginationChanged(event: any) {
    if (event.newPage) {
      alert(event.newPage);
      //this.loadPage(event.api.paginationGetCurrentPage());
    }
  }


  initializeColumnDialogRef(field:Iobject) {
    let data = field;
    let fields:any;
    
    fields = [
      new GenericFormField({
        _id:"plib",
        type:"1",
        body:{},
        placeholder:"Title (Min Length: 4, Max Length: 100)",
        required:true,
        minLength:-1,
        maxLength:-1
      }),
      new GenericFormField({
        _id:"pdesc",
        type:"2",
        body:{},
        placeholder:"title2 (Min Length: 4, Max Length: 100)",
        required:true,
        minLength:-1,
        maxLength:-1
      }),
      new GenericFormField({
        _id:"ptype",
        type:"3",
        body:{},
        placeholder:"title3 (Min Length: 4, Max Length: 100)",
        required:true,
        datasource:this.datatypes,
        minLength:-1,
        maxLength:-1
      })];
    

    const dialogRef = this.dialog.open(GenericComponent, {
      width: '420px',
      maxWidth: '95vw',
      height: '100vh',             // toute la hauteur
      position: { right: '0', top: '0' }, // collé à droite et en haut
      panelClass: 'full-height-dialog',
      data: { type:"properties",uid:-1, value:data, fields:fields },            // données d’entrée
      disableClose: true,        // évite la fermeture accidentelle
      autoFocus: 'first-tabbable'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.saved) {
        this.loadDataGrid();
      }
    });
  }

  addColumn(fieldUID:string = null) {
    let data:any;
    if (fieldUID) {
      this.apisServices.getTable(fieldUID,"fr").subscribe((data:any) => {
        data = data.result;
        //this.console.log(this._project);
        this.initializeColumnDialogRef(data);
      })
    } else {
      data = new Field();
      data._id = "-1";
      data._projprof.push(this.globalService.project._id+this.globalService.table._id)
      this.initializeColumnDialogRef(data);
    }
    //this.router.navigate(["/ekit/field/-1"]);
  }
  
  initializetableDialogRef(table:Iobject) {
    let data = table;
    let fields:any;
    
    fields = [
      new GenericFormField({
        _id:"plib",
        type:"1",
        body:{},
        placeholder:"Title (Min Length: 4, Max Length: 100)",
        required:true,
        minLength:-1,
        maxLength:-1
      }),
      new GenericFormField({
        _id:"pdesc",
        type:"2",
        body:{},
        placeholder:"title2 (Min Length: 4, Max Length: 100)",
        required:true,
        minLength:-1,
        maxLength:-1
      })
    ];
    

    const dialogRef = this.dialog.open(GenericComponent, {
      width: '420px',
      maxWidth: '95vw',
      height: '100vh',             // toute la hauteur
      position: { right: '0', top: '0' }, // collé à droite et en haut
      panelClass: 'full-height-dialog',
      data: { type:"prototypes",uid:-1, value:data, fields:fields },            // données d’entrée
      disableClose: true,        // évite la fermeture accidentelle
      autoFocus: 'first-tabbable'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.saved) {
        this.loadDataGrid();
      }
    });
  }

  addTable(tableUID:string = null) {
    let data:any;
    
    
    if (tableUID) {
      this.apisServices.getTable(tableUID,"fr").subscribe((data:any) => {
        data = data.result;
        //this.console.log(this._project);
        this.initializetableDialogRef(data);
      })
    } else {
        data = new Table();
        data._id = "-1";
        data.projects.push(this.globalService.project._id);
        this.initializetableDialogRef(data);
    }

  }


  addLine() {
    const newRow = {
      id: "-1"
    };

    // Insert en haut (index 0). En bas: retire addIndex.
    this.gridApi.applyTransaction({ add: [newRow], addIndex: 0 });

    // Optionnel: démarrer l’édition directement sur la 1re cellule
    setTimeout(() => {
      this.gridApi.startEditingCell({ rowIndex: 0, colKey: 'name' });
    });
  }

  /**
   * 
   * @param params 
   * 
   */
  async onCellValueChanged(e: any) {
    const row = e.data;
    const { colDef, field, data } = e;        // e.colDef / e.colDef.field
    const { oldValue, newValue } = e;
    let updatedField = new Entity();
    console.log(data);
    updatedField._id = (data.objectid?data.objectid:"-1");
    updatedField.projects = [this.globalService.project._id];
    updatedField.proto = [this.globalService.table._id];
    delete data.id
    updatedField.body = data;
    //this._project.langs = this.rowData.filter(row => row.actif ).map(row => { return row.code } );
    
    //return;
    this.apisServices.save(updatedField,"objects","fr").subscribe((resData:any) => {
      data.objectid = resData.ok;
    });
  }

  loadDataGrid() {
    // A mettre dans un service EKIT
    //
    if (this.globalService.table) {
      // IF SELECTED TABLE LOAD DYNAMIC COLUMS
      this.apisServices.getDynamicTableColumns("fr").pipe(
          map((res: any) => {
            console.log("res",res);
            return res.result.map(item => ({
                field: "p"+item._id,
                headerName: item.body.plib,
                type: this.getCellType(item.body.ptype),
                cellRenderer:this.getCellRendererTemplate(item.body.ptype),
                editable:true,
                headerComponent: PrototypeColHeader,
                headerComponentParams: { icon: 'info', tooltip: 'Détails statut' },
                //Si c'est la colonne titre on la fige a gauche
                pinned: (item.specifics && item.specifics[this.globalService.project._id+this.globalService.table._id].isTitleCol=='true'?"left":'none'),
                cellEditor: this.getCellEditorTemplate(item.body.ptype),
                //POUR TEST A INJECTER SI C'est un select
                cellEditorParams:{
                  values: this.getCellEditorTemplateParams(item,res.categoriesLines)
                },
                valueGetter: p => this.getCellEditorTemplateValueGetter(p,item),
                valueFormatter: (params: any) => {
                  const obj = this.getCellEditorTemplateValueFormater(params,item,res.categoriesLines);
                  if (obj)
                  {
                    const map: Record<string, string> = {"":"",...obj};
                    return map[params.value] || params.value;
                  }
                  else {return null;}
                }
            }));
          }),
          catchError((error) => {
            return throwError(error);
          })
      ).subscribe((data) => {
        this.colDefs = [...data,
          ( 
            this.globalService.table ? 
            {
              field: "add", 
              width: 20,
              headerComponent: AddHeaderButtonComponent, 
              headerComponentParams: {
                onAddColumn: () => this.addColumn(),              // callback vers le parent
                title: 'Ajouter une colonne'
              },
              sortable: false,
              filter: false,
              resizable: false,
              // Colonnes vides pour les lignes :
              valueGetter: () => null,                            // aucun contenu
              cellRenderer: () => '',                             // sécurité : rien à afficher
              suppressColumnsToolPanel: true,
            } : 
            null
          )
          ,
          { 
              field: "button", 
              cellRenderer: ActionCellRendererComponent,
              width: 100,
              sortable: false,
              cellRendererParams: () => ({
                onEdit: this.edit.bind(this),
                //onDelete: this.onDelete.bind(this),
              }),
              filter: false,pinned: 'right'
            }
        ];
        console.log("this.colDefs",this.colDefs);
        // IF TABLE MODE
        if (this.globalService.table) 
        { 
          
        }
        setTimeout(() => {
          const allColumnIds = this.gridApi.getColumns()?.map(col => col.getColId());
          this.gridApi.autoSizeColumns(allColumnIds);
          this.loadPage();
        });
      })
    }
    else {
      // IF ! SELECTED TABLE DISPLAY STATIC COLUMNS
      this.colDefs = [
        { field: "body.plib",headerName: 'Titre',pinned: 'left', 
          editable: true ,
          cellEditor: EditableTextCellTranslate, },
        { field: "body.pdesc",
          headerName: 'Description', 
          editable: true,
          cellEditor: EditableTextCellTranslate,
          },
        { field: "button", cellRenderer: ActionCellRendererComponent,width: 100,
          cellRendererParams: () => ({
            onEdit: this.edit.bind(this),
            //onDelete: this.onDelete.bind(this),
          }),
          sortable: false,
          filter: false,pinned: 'right'},
      ];
      // LOADIN PROJECTS TABLES
      this.apisServices.getProjectTables("fr")
        .pipe(
          map((res: any) => {
            return res.result;
          }),
          catchError((error) => {
            return throwError(error);
          })
      ).subscribe((data) => {
        this.rowData = data;
        setTimeout(() => {
          const allColumnIds = this.gridApi.getColumns()?.map(col => col.getColId());
          this.gridApi.autoSizeColumns(allColumnIds);
        });
      })
    }
  }

  edit(row: any) {
    console.log('edit depuis parent', row);
    this.addTable(row);
    // ... ta logique
  }

  // HERE WHEN GRID IS LOADED WHE CAN LOAD COLUMS
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.loadDataGrid();
  }
}
