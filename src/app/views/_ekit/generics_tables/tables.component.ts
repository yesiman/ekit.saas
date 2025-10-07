import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { ColDef, GridReadyEvent } from 'ag-grid-community';
import { environment } from 'environments/environment';
import { catchError, map, throwError } from 'rxjs';
import { CheckboxCellRenderer, themeBalham } from 'ag-grid-community';
import { ActionCellRendererComponent } from '../../../shared/components/_ekit/grid/action-cell-renderer.component';
import { EditableTextCellTranslate } from '../../../shared/components/_ekit/grid/editable-text-cell-translate.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GlobalService } from 'app/shared/services/_ekit/global.service';
import { CommonModule,Location } from '@angular/common';
import { EditableRelationCell } from '../../../shared/components/_ekit/grid/editable-relation-cell.component copy';
import { FormsModule } from '@angular/forms';
import { ApisService } from 'app/shared/services/_ekit/apis.service';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { AddHeaderButtonComponent } from 'app/shared/components/_ekit/grid/add-header-button.component';
import { Field } from 'app/shared/models/_ekit/field.model';
import { util_d$1 } from 'echarts/types/dist/shared';
import { Entity } from 'app/shared/models/_ekit/entity.model';
import { PropertieComponent } from '../propertie/propertie.component';
import { MatDialog } from '@angular/material/dialog';
import { PropertieModule } from '../propertie/propertie.module';

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

  

  gridApi;
  loading = true;
  constructor(
    private http: HttpClient,public globalService:GlobalService,
    private apisServices:ApisService,private _location: Location,
    private dialog:MatDialog
  ) {
   
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
  addColumn() {
    /*const dialogRef = this.dialog.open(PropertieModule, {
      width: '600px',
      maxWidth: '95vw',
      data: { },            // données d’entrée
      disableClose: true,        // évite la fermeture accidentelle
      autoFocus: 'first-tabbable'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.saved) {
        // rafraîchir la liste, etc.
      }
    });*/
    this.router.navigate(["/ekit/field/-1"]);
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

  // HERE WHEN GRID IS LOADED WHE CAN LOAD COLUMS
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
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
}
