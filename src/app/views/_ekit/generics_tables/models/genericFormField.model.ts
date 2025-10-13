export class GenericFormField {
    _id?:string;
    type:string;
    placeholder:string;
    required:boolean;
    minLength:number;
    visibleClause:string;
    model:any;
    maxLength:number;
    datasource:any;
    constructor(init?: Partial<GenericFormField>) {
        Object.assign(this, init);
    }
}