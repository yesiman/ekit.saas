import { Iobject } from "./iobject.model";

export class Project implements Iobject {
  _id?:string;
  body:any;
  langs?:string[];
  versions?:string[];
  defaultLang:string;
  constructor() {
    this.langs = ["fr"];
    this.versions = ["fr"];
    this.defaultLang = "fr";
    this.body = {
      plib:"Nouveau",
      pdesc:""
    }
  }
}