import { Iobject } from "./iobject.model";

export class Entity implements Iobject {
  _id?:string;
  body:any;
  versions?:string[];
  projects:string[];
  proto:string[];
  constructor() {
    this.versions = ["fr"];
    this.body = {
    }
  }
}