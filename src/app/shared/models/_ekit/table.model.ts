import { Iobject } from "./iobject.model";

export class Table implements Iobject {
  _id?:string;
  body:any;
  versions?:string[];
  projects:string[];
  specifics:any;
  constructor() {
    this.versions = ["fr"];
    this.projects = [];
    this.body = {
      plib:"Nouveau",
      pdesc:""
    }
  }
  
}