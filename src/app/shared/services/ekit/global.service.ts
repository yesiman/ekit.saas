import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'  // Singleton accessible partout
})
export class GlobalService {
  //project storage
  private _project: string = '';
  get project(): string {
    return this._project;
  }
  set project(value: string) {
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