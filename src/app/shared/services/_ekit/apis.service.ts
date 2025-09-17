import { Injectable } from '@angular/core';
import { LocalStoreService } from '../local-store.service';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'  // Singleton accessible partout
})


export class ApisService {
  constructor(private http: HttpClient,private ls:LocalStoreService,private globalService:GlobalService) {}
  getDynamicTableColumns = () => {
    return this.http.post(`${environment.apiURL}/datas/get`, { projectUID:this.globalService.project.uid, tableUID:this.globalService.table, coordinates:"X" })
  }
  getProjectTables = () => {
    return this.http.post(`${environment.apiURL}/datas/get`, { projectUID:this.globalService.project.uid })
  }
}