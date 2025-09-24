import { Injectable } from '@angular/core';
import { LocalStoreService } from '../local-store.service';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { Project } from 'app/shared/models/_ekit/product.model';

@Injectable({
  providedIn: 'root'  // Singleton accessible partout
})


export class ApisService {
  constructor(private http: HttpClient,private ls:LocalStoreService,private globalService:GlobalService) {}
  getDynamicTableColumns = () => {
    return this.http.post(`${environment.apiURL}/datas/get`, { projectUID:this.globalService.project._id, tableUID:this.globalService.table, coordinates:"X" })
  }
  getProjectTables = () => {
    return this.http.post(`${environment.apiURL}/datas/get`, { projectUID:this.globalService.project._id })
  }

  getProject = (uid:string) => {
    return this.http.get(`${environment.apiURL}/projects/`+uid)
  }

  saveProject(project:Project) {
    if (project._id == "-1") {
      console.log("saveProject","post");
      return this.http.post(`${environment.apiURL}/projects/`, project)
    } 
    else {
      console.log("saveProject","put");
      return this.http.put(`${environment.apiURL}/projects/`+project._id, project)
    }
  }
}