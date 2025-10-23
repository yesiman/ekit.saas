import { Injectable } from "@angular/core";
import { GenericFormField } from "../../../models/genericFormField.model";
import { Table } from "app/shared/models/_ekit/table.model";
import { Entity } from "app/shared/models/_ekit/entity.model";

@Injectable({
  providedIn: 'root',
})

export class EntityGenericService {
    getColumns(entity:Entity,coldef:any) {
        let fields = [];
        
        coldef.forEach(element => {
          if (element.headerComponentParams) {
            console.log(element);
            fields.push(
              new GenericFormField({
                _id:"p"+element.headerComponentParams.uid,
                model:entity.body,
                type:element.headerComponentParams.ptype,
                placeholder:element.headerName,
                required:false,
                minLength:-1,
                maxLength:-1
              })
            );
          }
        });
        return fields;
      }
}