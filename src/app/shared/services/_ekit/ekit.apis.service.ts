import { Injectable } from '@angular/core';
import { LocalStoreService } from '../local-store.service';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { Project } from 'app/shared/models/_ekit/project.model';
import { Iobject } from 'app/shared/models/_ekit/iobject.model';

@Injectable({
  providedIn: 'root'  // Singleton accessible partout
})


export class EkitApisService {
  constructor(private http: HttpClient,private ls:LocalStoreService,private globalService:GlobalService) {}
  getDynamicTableColumns = (lang:string) => {
    return this.http.post(`${environment.apiURL}/datas/${lang}`, { projectUID:this.globalService.project._id, tableUID:this.globalService.table._id, coordinates:"X" })
  }
  getProjectTables = (lang:string) => {
    return this.http.post(`${environment.apiURL}/datas/${lang}`, { projectUID:this.globalService.project._id, type:"tables" })
  }
  getProjectTemplates = (lang:string) => {
    return this.http.post(`${environment.apiURL}/datas/${lang}`, { projectUID:this.globalService.project._id,  type:"templates" })
  }
  getProject = (uid:string,lang:string) => {
    return this.http.get(`${environment.apiURL}/projects/${lang}/`+uid)
  }
  getTable = (uid:string,lang:string) => {
    return this.http.get(`${environment.apiURL}/prototypes/${lang}/`+uid)
  }
  getEntity = (uid:string,lang:string) => {
    return this.http.get(`${environment.apiURL}/objects/${lang}/`+uid)
  }
  getField = (uid:string,lang:string) => {
    return this.http.get(`${environment.apiURL}/properties/${lang}/`+uid)
  }
  loadGmapLibrary() {
    return this.http.jsonp('https://maps.googleapis.com/maps/api/js?key='+environment.googleConfig.mapKey, 'callback');
  }
  save = (obj:Iobject,repo:string,lang:string) => {
    console.log(repo,obj);
    if (obj._id == "-1") {
      return this.http.post(`${environment.apiURL}/${repo}/${lang}/`, obj)
    } 
    else {
      return this.http.put(`${environment.apiURL}/${repo}/${lang}/`+obj._id, obj)
    }
  }
  delete = (uid:string,repo:string,lang:string) => {
    try 
    {
      return this.http.delete(`${environment.apiURL}/${repo}/${lang}/`+uid)
    }
    catch(err) {
      console.log("err",err);
    }
    
  }

}