import { Iobject } from "./iobject.model";

export class Field implements Iobject {
  _id?:string;
  body:any;
  versions?:string[];
  _projprof?:string[];
  constructor() {
    this.versions = ["fr"];
    this._projprof = [];
    this.body = {
      plib:"Nouveau",
      pdesc:""
    }
  }
  
}