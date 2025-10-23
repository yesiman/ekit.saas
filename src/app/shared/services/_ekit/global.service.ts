import { Injectable, signal, WritableSignal } from '@angular/core';
import { LocalStoreService } from '../local-store.service';
import { Project } from 'app/shared/models/_ekit/project.model';
import { Table } from 'app/shared/models/_ekit/table.model';

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
  private _table: Table;
  get table(): Table {
    return this._table;
  }
  set table(value: Table) {
    this._table = value;
  }
  private _appLang = signal("fr");
  get appLang():WritableSignal<string> {
    return this._appLang;
  }
  set appLang(value: string) {
    this._appLang.set(value);
  }
}