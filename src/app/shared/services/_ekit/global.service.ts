import { Injectable } from '@angular/core';
import { LocalStoreService } from '../local-store.service';
import { Project } from 'app/shared/models/_ekit/project.model';

@Injectable({
  providedIn: 'root'  // Singleton accessible partout
})



export class GlobalService {
  constructor(private ls:LocalStoreService) {}
  //project storage
  private _project: Project;
  get project(): Project {
    //SI ON A PAS LE PROJET ON LE LOAD DU LOCALSERVICE
    if (!this._project) {
      this._project = this.ls.getItem("currentProject");
    }
    return this._project;
  }
  set project(value: Project) {
    this._project = value;
  }
  //table storage
  private _table: string = '';
  get table(): string {
    return this._table;
  }
  set table(value: string) {
    this._table = value;
  }
}