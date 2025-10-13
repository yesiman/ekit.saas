import { Injectable } from "@angular/core";
import { GenericFormField } from "../../../models/genericFormField.model";
import { Table } from "app/shared/models/_ekit/table.model";

@Injectable({
  providedIn: 'root',
})

export class TableGenericService {
    getColumns(table:Table) {
        
        return [
          new GenericFormField({
            _id:"plib",
            model:table.body,
            type:"1",
            placeholder:"Title (Min Length: 4, Max Length: 100)",
            required:true,
            minLength:-1,
            maxLength:-1
          }),
          new GenericFormField({
            _id:"pdesc",
            model:table.body,
            type:"2",
            placeholder:"title2 (Min Length: 4, Max Length: 100)",
            required:true,
            minLength:-1,
            maxLength:-1
          })
        ];
        
      }
}