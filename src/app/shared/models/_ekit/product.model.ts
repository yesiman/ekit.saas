export class Project {
  _id?:string;
  langs?:string[];
  body:any;
  constructor() {
    this.langs = ["fr"];
    this.body = {
      plib:"Nouveau",
      pdesc:""
    }
  }
}