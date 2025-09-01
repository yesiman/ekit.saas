import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { ColDef, GridReadyEvent } from 'ag-grid-community';
import { environment } from 'environments/environment';
import { catchError, map, throwError } from 'rxjs';


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
  imports: [AgGridAngular,MatCardModule],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss'
})

export class TablesComponent {

    constructor(
      private http: HttpClient
    ) {}

  // Row Data: The data to be displayed.
    rowData: IRow[] = [];
    colDefs: ColDef[] = [
        { field: "body.plib",headerName: 'Titre', },
        { field: "body.pdesc",headerName: 'Description' },
    ];

    onGridReady(params: GridReadyEvent) {

      this.http.post(`${environment.apiURL}/tables/get`, { })
            .pipe(
              map((res: any) => {
                return res.result;
              }),
              catchError((error) => {
                return throwError(error);
              })
          ).subscribe((data) => {
            console.log(data);
            this.rowData = data;
          })

      //this.http
      //    .get<any[]>('https://www.ag-grid.com/example-assets/space-mission-data.json')
      //    .subscribe(data => {
      //      console.log(data);
      //      this.rowData = data});
    }
}
