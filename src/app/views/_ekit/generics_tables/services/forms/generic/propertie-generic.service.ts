import { Iobject } from "app/shared/models/_ekit/iobject.model";
import { GenericFormField } from "../../../models/genericFormField.model";
import datatypes from 'assets/ressources/datatypes.json'
import { Injectable } from "@angular/core";
import { GlobalService } from "app/shared/services/_ekit/global.service";
import { ApisService } from "app/shared/services/_ekit/apis.service";
import { catchError, map, throwError } from "rxjs";

@Injectable({
  providedIn: 'root',
})

export class PropertyGenericService {
  datatypes;
  constructor(private globalService:GlobalService, private apisServices:ApisService) {
    this.datatypes = datatypes;
    //LOAD PROTOTYPES FOR TYPE PROTOTYPE LIST OPTIONS
    
  }
  getColumns(field:Iobject, tables) {
      if (!field["specifics"]) {
        field["specifics"] = {};
        field["specifics"][this.globalService.project._id+this.globalService.table._id] = {};
      }
      if (!field["config"]) {
        field["config"] = {};
      }
      
      return [
        new GenericFormField({
          _id:"plib",
          type:"5912f7034c3181110079e09e",
          model:field.body,
          placeholder:"Title (Min Length: 4, Max Length: 100)",
          required:true,
          minLength:-1,
          maxLength:-1
        }),
        new GenericFormField({
          _id:"pdesc",
          type:"5912f7194c3181110079e09f",
          model:field.body,
          placeholder:"title2 (Min Length: 4, Max Length: 100)",
          required:true,
          minLength:-1,
          maxLength:-1
        }),
        new GenericFormField({
          _id:"ptype",
          type:"5912f82d4c3181110079e0a6",
          model:field.body,
          placeholder:"title3 (Min Length: 4, Max Length: 100)",
          required:true,
          datasource:this.datatypes,
          minLength:-1,
          maxLength:-1
        }),
        new GenericFormField({
          _id:"categid",
          type:"5912f82d4c3181110079e0a6",
          model:field["config"],
          visibleClause:'5912f8194c3181110079e0a5,5912f82d4c3181110079e0a6',
          placeholder:"Type d'objet lié",
          required:false,
          datasource:tables.map(item => { 
            return {
              code:item._id,
              name:item.body.plib
            }
          }),
          minLength:-1,
          maxLength:-1
        }),
        new GenericFormField({
          _id:"textminl",
          type:"5912f7034c3181110079e09e",
          model:field["config"],
          visibleClause:'5912f7194c3181110079e09f,5912f7034c3181110079e09e',
          placeholder:"Taille mini",
          required:false,
          minLength:-1,
          maxLength:-1
        }),
        new GenericFormField({
          _id:"textmaxl",
          type:"5912f7034c3181110079e09e",
          model:field["config"],
          visibleClause:'5912f7194c3181110079e09f,5912f7034c3181110079e09e',
          placeholder:"Taille maxi",
          required:false,
          minLength:-1,
          maxLength:-1
        }),
        new GenericFormField({
          _id:"multiling",
          model:field,
          type:"5912f8144c3181110079e0a4",
          placeholder:"Multilingue",
          required:false
        }),
        new GenericFormField({
          _id:"isTitleCol",
          model:field["specifics"][this.globalService.project._id+this.globalService.table._id],
          type:"5912f8144c3181110079e0a4",
          placeholder:"Titre",
          required:false
        }),
        new GenericFormField({
          _id:"required",
          model:field["specifics"][this.globalService.project._id+this.globalService.table._id],
          type:"5912f8144c3181110079e0a4",
          placeholder:"Obligatoire",
          required:false
        })];

    }
    
}