import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { ColDef, GridReadyEvent } from 'ag-grid-community';
import { environment } from 'environments/environment';
import { catchError, map, throwError } from 'rxjs';
import { themeBalham } from 'ag-grid-community';
import { ActionCellRendererComponent } from '../components/action-cell-renderer.component';
import { EditableCellTranslate } from '../components/editable-cell-translate.component';

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
    AgGridAngular,
  ],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss',
  standalone: true,
})

export class TablesComponent {

    constructor(
      private http: HttpClient
    ) {}

  // Row Data: The data to be displayed.
    rowData: IRow[] = [];
    colDefs: ColDef[] = [
        { field: "body.plib",headerName: 'Titre',pinned: 'left', 
          editable: true ,
          cellEditor: EditableCellTranslate, },
        { field: "body.pdesc",
          headerName: 'Description', 
          editable: true,
          cellEditor: EditableCellTranslate,
         },
        { field: "button", cellRenderer: ActionCellRendererComponent,width: 100,
          sortable: false,
          filter: false,pinned: 'right'},
    ];
    agGridTheme = themeBalham;

    onGridReady(params: GridReadyEvent) {
      const gridApi = params.api;
      this.http.post(`${environment.apiURL}/tables/get`, { })
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
              const allColumnIds = gridApi.getColumns()?.map(col => col.getColId());
              gridApi.autoSizeColumns(allColumnIds);
            });
          })

      //this.http
      //    .get<any[]>('https://www.ag-grid.com/example-assets/space-mission-data.json')
      //    .subscribe(data => {
      //      console.log(data);
      //      this.rowData = data});
    }
}
