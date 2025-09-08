import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { ColDef, GridReadyEvent } from 'ag-grid-community';
import { environment } from 'environments/environment';
import { catchError, map, throwError } from 'rxjs';
import { themeBalham } from 'ag-grid-community';
import { ActionCellRendererComponent } from '../components/action-cell-renderer.component';
import { EditableTextCellTranslate } from '../components/editable-text-cell-translate.component';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'app/shared/services/ekit/global.service';
import { CommonModule } from '@angular/common';
import { EditableRelationCell } from '../components/editable-relation-cell.component copy';

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
    AgGridAngular,
  ],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss',
  standalone: true,
})

export class TablesComponent {
  private route = inject(ActivatedRoute);
  gridApi;
  loading = true;
  constructor(
    private http: HttpClient,public globalService:GlobalService
  ) {
   
  }

  ngOnInit() {
    
    this.route.params.subscribe(routeParams => {
      this.loading = true;
      this.rowData = [];
      this.colDefs = [];
      this.globalService.project = routeParams.projectuid;
      this.globalService.table = (routeParams.tableuid?routeParams.tableuid:null);
      setTimeout(() => {
        this.loading = false;          // recrée la grille
      });
	  });
  }

  rowData: IRow[] = [];
  colDefs: ColDef[] = [];
  agGridTheme = themeBalham;

  // LOAD PAGINATING DATAS
  loadPage() {
    this.http.post(`${environment.apiURL}/datas/get`, { projectUID:this.globalService.project, tableUID:this.globalService.table, coordinates:"Y" })
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

      console.log("lines",data);

      this.rowData = data;
      setTimeout(() => {
        //const allColumnIds = this.gridApi.getColumns()?.map(col => col.getColId());
        //this.gridApi.autoSizeColumns(allColumnIds);
      });
    })
  }

  // MANAGE CELL EDITOR STYLE FROM PROPERTY TYPE
  getCellEditorTemplate(ptype:string) {
    switch (ptype) {
      //SELECT / ENUMS
      case "5912f82d4c3181110079e0a6":
        return 'agSelectCellEditor';
      // TEXTE BASIC
      case "5912f7034c3181110079e09e":
        return EditableTextCellTranslate;
    }
    return null;
  }
  // MANAGE CELL ENUMS IDS PARAMS
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
  // MANAGE CELL ENUMS IDS PARAMS RELATIONS WITH LABELS
  getCellEditorTemplateValueFormater(colItem:any,categoriesLines:any[]) {
    //ON TEST LE PTYPE DE L'ELEMENT
    switch (colItem.body.ptype) {
      // LIEN INTERPROFIL
      case "5912f82d4c3181110079e0a6":
        const filteredCategoriesLines = categoriesLines.filter(item => (item.curProto == colItem.config.categid));
        const withEmplyVal = filteredCategoriesLines
        return Object.fromEntries(filteredCategoriesLines.map(item => [item._id.toString(), item.body.p5b5ea8fd0311784a87b6dc0a]));
    }
    return null;
  }
  // MANAGE CELL RENDER STYLE FROM PROPERTY TYPE
  getCellRendererTemplate(ptype:string) {
    
    switch (ptype) {
      // LIEN INTERPROFIL
      case "5912f8194c3181110079e0a5":
        return EditableRelationCell;
    }
    return null;
  }
  onPaginationChanged(event: any) {
    if (event.newPage) {
      alert(event.newPage);
      //this.loadPage(event.api.paginationGetCurrentPage());
    }
  }
  // HERE WHEN GRID IS LOADED WHE CAN LOAD COLUMS
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    // A mettre dans un service EKIT
    //
    if (this.globalService.table) {
      // IF SELECTED TABLE LOAD DYNAMIC COLUMS
      this.http.post(`${environment.apiURL}/datas/get`, { projectUID:this.globalService.project, tableUID:this.globalService.table, coordinates:"X" })
        .pipe(
          map((res: any) => {
            console.log("res",res);
            return res.result.map(item => ({
                field: "p"+item._id,
                headerName: item.body.plib,
                cellRenderer: this.getCellRendererTemplate(item.body.ptype),
                editable:true,
                //Si c'est la colonne titre on la fige a gauche
                pinned: (item.specifics[this.globalService.project+this.globalService.table].isTitleCol=='true'?"left":'none'),
                cellEditor: this.getCellEditorTemplate(item.body.ptype),
                //POUR TEST A INJECTER SI C'est un select
                cellEditorParams:{
                  values: this.getCellEditorTemplateParams(item,res.categoriesLines)
                },
                valueFormatter: (params: any) => {
                  const obj = this.getCellEditorTemplateValueFormater(item,res.categoriesLines);
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
        this.colDefs = [...data,{ 
          field: "button", 
          cellRenderer: ActionCellRendererComponent,
          width: 100,
          sortable: false,
          filter: false,pinned: 'right'}
        ];
        setTimeout(() => {
          const allColumnIds = this.gridApi.getColumns()?.map(col => col.getColId());
          this.gridApi.autoSizeColumns(allColumnIds);
          this.loadPage();
        });
      })
    }
    else {
      // IF SELECTED TABLE DISPLAY STATIC COLUMNS
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
      this.http.post(`${environment.apiURL}/datas/get`, { projectUID:this.globalService.project })
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
