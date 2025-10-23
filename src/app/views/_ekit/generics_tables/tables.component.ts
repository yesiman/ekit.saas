import { HttpClient } from '@angular/common/http';
import { Component, effect, inject, ɵrestoreComponentResolutionQueue } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { CellClickedEvent, ColDef, GridReadyEvent } from 'ag-grid-community';
import { environment } from 'environments/environment';
import { BehaviorSubject, catchError, filter, lastValueFrom, map, throwError } from 'rxjs';
import { CheckboxCellRenderer, colorSchemeDark, colorSchemeDarkBlue, themeBalham } from 'ag-grid-community';
import { ActionCellRendererComponent } from './components/grid/cells/action-cell-renderer.component';
import { EditableTextCellTranslate } from './components/grid/cells/editable-text-cell-translate.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GlobalService } from 'app/shared/services/_ekit/global.service';
import { CommonModule,Location } from '@angular/common';
import { EditableRelationCell } from './components/grid/cells/relation-cell-renderer.component';
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
import { GenericFormField } from './models/genericFormField.model';
import datatypes from 'assets/ressources/datatypes.json'
import { Table } from 'app/shared/models/_ekit/table.model';
import { PrototypeColHeader } from './components/grid/headers/prototype_col_header.component';
import { TableGenericService } from './services/forms/generic/table-generic.service';
import { PropertyGenericService } from './services/forms/generic/propertie-generic.service';
import { ThemeService } from 'app/shared/services/theme.service';
import { CustomAutocompleteEditorComponent } from './components/grid/cells/custom-autocomplete-editor.component';
import { RichtextEditorComponent } from './components/forms/editors/richtext-editor/richtext-editor.component';
import { da } from 'date-fns/locale';
import { MapEditorComponent } from './components/forms/editors/map-editor/map-editor.component';
import { EntityGenericService } from './services/forms/generic/entity-generic.service';

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
  gs = inject(GlobalService);

  datatypes;
  agGridTheme:any;
  gridApi;
  loading = true;
  constructor(
    private http: HttpClient,public globalService:GlobalService,
    private apisServices:ApisService,private _location: Location,
    private dialog:MatDialog, private tablesGenericService:TableGenericService,
    private propertyGenericService:PropertyGenericService,
    private entityGenericService:EntityGenericService,
    private themeService:ThemeService
  ) {
    this.datatypes = datatypes;
  }

  ngOnInit() {

    

    this.route.params.subscribe(routeParams => {
      this.loading = true;
      this.rowData = [];
      this.colDefs = [];
      this.globalService.table = null;
      //
      this.agGridTheme = this.themeService.getGridTheme();
      //
      if (routeParams.tableuid) {
        this.apisServices.getTable(routeParams.tableuid,this.globalService.appLang()).subscribe((data:any) => {
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

  
 logLangChange = effect(() => {
      const current = this.gs.appLang();   // <- lecture du signal
      this.loadPage();
      // ... placer ici tout traitement (side effects) déclenché par le changement
  });

  rowData: IRow[] = [];
  colDefs: ColDef[] = [];

  
  //agGridTheme = this.themeService.agGridTheme;
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
    
    this.http.post(`${environment.apiURL}/datas/`+this.globalService.appLang(), { projectUID:this.globalService.project._id, tableUID:this.globalService.table._id, coordinates:"Y" })
      .pipe(
        map((res: any) => {
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
      case "5912f8194c3181110079e0a5":
        return CustomAutocompleteEditorComponent;
      //SELECT / ENUMS
      case "5912f82d4c3181110079e0a6":
        return 'agSelectCellEditor';
      // TEXTE BASIC
      case "5912f7034c3181110079e09e":
        return EditableTextCellTranslate;
      case "5a782af376657811002d0416":
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
      // ENUMERATION
      case "5912f82d4c3181110079e0a6":
        const filteredCategoriesLines = categoriesLines.filter(item => (item.proto.find((itemProto:string) => itemProto == colItem.config.categid)));
        const finalCategoriesLines = (filteredCategoriesLines.map(item => {
          return item._id;
        }))
        return {values:finalCategoriesLines};
      case "5912f8194c3181110079e0a5":
        return {
          fetchFn: (q: string, page: number) => this.fetchUsers(q, page), // retourne Promise<{items: any[], total: number}>
          optionLabel: (o: any) => o.name,   // comment afficher
          optionValue: (o: any) => o.id,     // ce qui est sauvegardé dans la cellule
          minChars: 1,                       // déclenchement dès 1 caractère
          pageSize: 30,                      // pagination côté serveur
          debounceMs: 250,                   // anti-spam requêtes
          placeholder: 'Rechercher un utilisateur…'
        }
    }
    return null;
  }

  // my.service.ts
fetchUsers(q: string, page: number) {
  const pageSize = 30;
  return [];//fetch(`/api/users?query=${encodeURIComponent(q)}&page=${page}&pageSize=${pageSize}`)
    //.then(r => r.json()); // { items: [{id,name}], total: 123 }
}
  /** 
   * MANAGE CELL ENUMS IDS PARAMS RELATIONS WITH LABELS
   * */ 
  getCellEditorTemplateValueFormater(params:any,colItem:any,categoriesLines:any[],categoriesPrototypesTitles:any) {
    //ON TEST LE PTYPE DE L'ELEMENT
    switch (colItem.body.ptype) {
      // LIEN INTERPROFIL
      case "5912f82d4c3181110079e0a6":
        const filteredCategoriesLines = categoriesLines.filter(item => (item.proto.find((itemProto:string) => item._id == params.value)));
        if (filteredCategoriesLines.length>0) {
          return filteredCategoriesLines[0]["body"]["p"+categoriesPrototypesTitles[filteredCategoriesLines[0].proto[0]]];
        }
        else {
          return "";
        }
      // DATE
      case "5a782af376657811002d0416":
      case "5b33228daf1f20140098fbf8":
        //console.log("getCellEditorTemplateValueFormater");
        //return new Date().toLocaleDateString();
    }
    return null;
  }
  /** 
   * MANAGE CELL RENDER STYLE FROM PROPERTY TYPE
   * */ 
  getCellRendererTemplate(ptype:string) {
    switch (ptype) {
      // LIEN INTERPROFIL
      case "5912f8194c3181110079e0a5":
        console.log("ssss");
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
      case "5a782af376657811002d0416":
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
      case "5a782af376657811002d0416":
      case "5b33228daf1f20140098fbf8":
        console.log("getCellEditorTemplateValueGetter");
        return (p.data["p"+item.body.objectid]?new Date(p.data["p"+item.body.objectid]).toLocaleDateString():"");
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

  loadDialogRef(type:string,data:any,fields:any) {
        const dialogRef = this.dialog.open(GenericComponent, {
          width: '420px',
          maxWidth: '95vw',
          height: '100vh',             // toute la hauteur
          position: { right: '0', top: '0' }, // collé à droite et en haut
          panelClass: 'full-height-dialog',
          data: { type:type,uid:-1, value:data, fields:fields },            // données d’entrée
          disableClose: true,        // évite la fermeture accidentelle
          autoFocus: 'first-tabbable'
        });
    
        dialogRef.afterClosed().subscribe(result => {
        if (result?.saved) {
            this.loadDataGrid();
        }
        });
    }
  

  async addColumn(fieldUID?:string) {
    let data:any;
    let tables:any = await lastValueFrom(this.apisServices.getProjectTables(this.globalService.appLang()));
    if (fieldUID) {
      data = await lastValueFrom(this.apisServices.getField(fieldUID,this.globalService.appLang()));
      //console.log('data',data);
      const fields:any = this.propertyGenericService.getColumns(data.result,tables.result);
      console.log('fields',fields);
      this.loadDialogRef("properties",data.result,fields);
      //})
    } else {
      data = new Field();
      data._id = "-1";
      data._projprof.push(this.globalService.project._id+this.globalService.table._id)
      const fields = this.propertyGenericService.getColumns(data,tables.result);
      this.loadDialogRef("properties",data,fields);
    }
    //this.router.navigate(["/ekit/field/-1"]);
  }
  
  

  

  addTable(tableUID:string = null) {
    let data:any;
    
    
    if (tableUID) {
      this.apisServices.getTable(tableUID,this.globalService.appLang()).subscribe((data:any) => {
        data = data.result;
        //this.console.log(this._project);
        const fields = this.tablesGenericService.getColumns(data);
        this.loadDialogRef("prototypes",data,fields);
      })
    } else {
        data = new Table();
        data._id = "-1";
        data.projects.push(this.globalService.project._id);
        const fields = this.tablesGenericService.getColumns(data);
        this.loadDialogRef("prototypes",data,fields);
        
    }

  }

  addRow(entityUID:string = null) {
    let data:any;
    

    if (entityUID) {
      console.log("entityUID",entityUID);
      this.apisServices.getEntity(entityUID,this.globalService.appLang()).subscribe((data:any) => {
        console.log("data",data);
        data = data.result as Entity;
        
        //this.console.log(this._project);
        const fields = this.entityGenericService.getColumns(data,this.colDefs);
        this.loadDialogRef("objects",data,fields);
      })
    } else {
        console.log("entityUID",entityUID);
        data = new Entity();
        data._id = "-1";
        //data.projects.push(this.globalService.project._id);
        const fields = this.entityGenericService.getColumns(data,this.colDefs);
        this.loadDialogRef("objects",data,fields);
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
   * WHEN OBJECT CELL CLICKED SHOW DATATAYPE CORRESPONDING EDITION FORM IF NEEDED EX:geolocation
   * @param e 
   * @returns 
   */
  async onCellClicked(e:CellClickedEvent) {
    console.log("onCellClicked",e);

    const ptype = e.colDef?.headerComponentParams?.ptype;
    const fielduid = e.colDef.field;
    const objectuid = e.data._id;
    console.log({ value:e.data[fielduid], objectuid:objectuid });
    let popupComponent:any = null;
    // TEST ON PTYPE AND SHOW RELATED EDITION POPUP
    switch (ptype) {
      case "5912f7204c3181110079e0a0":
        popupComponent = RichtextEditorComponent;
        break;
      case "5912f7344c3181110079e0a3":
        popupComponent = MapEditorComponent;
        break;
        
    }
    if (!popupComponent) { return; }
    const dialogRef = this.dialog.open(popupComponent, {
      width: '420px',
      maxWidth: '95vw',
      height: '100vh',             // toute la hauteur
      position: { right: '0', top: '0' }, // collé à droite et en haut
      panelClass: 'full-height-dialog',
      data: { value:e.data[fielduid], objectuid:objectuid },            // données d’entrée
      disableClose: true,        // évite la fermeture accidentelle
      autoFocus: 'first-tabbable'
    });

    dialogRef.afterClosed().subscribe(result => {
      // UPDATE SERVER DATA ON VALUE RETURN CHANGE EVENT
      if (result?.saved) {
        e.data[fielduid] = e.value = result.value;
        e.data.objectid = this.saveObjectField((objectuid?objectuid:"-1"),e.data);
        e.api.refreshCells();
      }
    });    
  }

  /**
   * UPDATE SERVER DATA ON CELL CHANGE EVENT
   * @param params 
   * 
   */
  async onCellValueChanged(e: any) {
    const row = e.data;
    const { colDef, field, data } = e;        // e.colDef / e.colDef.field
    const { oldValue, newValue } = e;
    //
    data.objectid = await this.saveObjectField((data.objectid?data.objectid:"-1"),data);
  }

  async saveObjectField(id:string,body:any) {
    let entity = new Entity();
    entity._id = id;
    entity.projects = [this.globalService.project._id];
    entity.proto = [this.globalService.table._id];
    delete body.id
    entity.body = body;
    console.log("entity",entity);
    const saveResult:any = await lastValueFrom(this.apisServices.save(entity,"objects",this.globalService.appLang()));
    return saveResult.ok;
  }

  loadDataGrid() {
    // A mettre dans un service EKIT
    //
    
    if (this.globalService.table) {
      
      // IF SELECTED TABLE LOAD DYNAMIC COLUMS
      
      this.apisServices.getDynamicTableColumns(this.globalService.appLang()).pipe(
          map((res: any) => {
            return res.result.map(item => ({
                field: "p"+item._id,
                headerName: item.body.plib,
                type: this.getCellType(item.body.ptype),
                cellRenderer:this.getCellRendererTemplate(item.body.ptype),
                editable:true,
                filter:true,
                headerComponentParams: { 
                  innerHeaderComponent: PrototypeColHeader,
                  onAddColumn: (uid?:string) => this.addColumn(uid), 
                  uid:item._id,
                  icon: 'settings', tooltip: 'Détails statut',
                  ptype:(item.body.ptype?item.body.ptype:null)
                },
                //Si c'est la colonne titre on la fige a gauche
                  pinned: (item.specifics &&  item.specifics[this.globalService.project._id+this.globalService.table._id].isTitleCol==true?"left":'none'),
                cellEditor: this.getCellEditorTemplate(item.body.ptype),
                //POUR TEST A INJECTER SI C'est un select
                frameworkComponents: {
                  customAutocompleteEditor: CustomAutocompleteEditorComponent
                },
                cellEditorParams:this.getCellEditorTemplateParams(item,res.categoriesLines),
                valueGetter: p => this.getCellEditorTemplateValueGetter(p,item),
                valueFormatter: (params: any) => {
                  return this.getCellEditorTemplateValueFormater(params,item,res.categoriesLines,res.categoriesPrototypesTitles);
                  /*if (obj)
                  {
                    const map: Record<string, string> = {"":"",...obj};
                    return map[params.value] || params.value;
                  }
                  else {return null;}*/
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
                onAddColumn: (uid?:string) => this.addColumn(uid),              // callback vers le parent
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
                onDelete: this.delete.bind(this),
              }),
              filter: false,pinned: 'right'
            }
        ];

        this.gridApi.refreshHeader();
        //this.gridApi.setColumnDefs(this.colDefs);
        //console.log("this.colDefs",this.colDefs);
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
            onDelete: this.delete.bind(this),
          }),
          sortable: false,
          filter: false,pinned: 'right'},
      ];
      // LOADIN PROJECTS TABLES
      this.apisServices.getProjectTables(this.globalService.appLang())
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
    if (this.globalService.table) {
      this.addRow(row);
      // OBJECT EDITION POPUP MODE

    }
    else {
      this.addTable(row);
    }
    
    // ... ta logique
  }
  delete(row: any) {
    let repo = "prototypes"
    if (this.globalService.project && this.globalService.table) {
      repo = "objects"
    }
    this.apisServices.delete(row,repo,this.globalService.appLang()).subscribe((data:any) => {
      this.loadDataGrid();
    })
  }

  // HERE WHEN GRID IS LOADED WHE CAN LOAD COLUMS
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.loadDataGrid();
  }
}
