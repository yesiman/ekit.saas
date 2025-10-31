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


export class TemplatingApisService {
  constructor(private http: HttpClient,private ls:LocalStoreService,private globalService:GlobalService) {}
  getTree = (templateUID:string) => {
    return this.http.get(`${environment.apiURL}/templates/tree/${templateUID}`);
  }
  getFile = (path:string,templateUID:string) => {
    return this.http.post(`${environment.apiURL}/templates/file/${templateUID}`, {path:path});
  }
  saveFile = (path:string, value:string,templateUID:string) => {
    return this.http.put(`${environment.apiURL}/templates/file/${templateUID}`, {path:path,content:value});
  }
}