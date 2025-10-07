export class GenericFormField {
    _id?:string;
    type:string;
    body:any;
    controlName?:string;
    placeholder:string;
    model:string;
    required:boolean;
    minLength:number;
    maxLength:number;
    datasource:any;
    constructor(init?: Partial<GenericFormField>) {
        Object.assign(this, init);
    }
}