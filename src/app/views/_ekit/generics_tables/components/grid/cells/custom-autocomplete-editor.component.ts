// custom-autocomplete-editor.component.ts
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, switchMap, startWith, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-custom-autocomplete-editor',
  imports:[MatAutocompleteModule,CommonModule,ReactiveFormsModule,MatFormFieldModule],

  template: `
    <input #input  name="test" id="test" matInput [placeholder]="params?.placeholder"
         [formControl]="ctrl"
         [matAutocomplete]="auto"
         (keydown)="onKeydown($event)" />
    
        <mat-autocomplete #auto="matAutocomplete" (optionSelected)="onSelected($event)">
            <mat-option *ngFor="let opt of options$ | async" [value]="label(opt)">
            {{ label(opt) }}
            </mat-option>
            

            <mat-option *ngIf="loading">Chargement…</mat-option>
            <mat-option *ngIf="!loading && empty">Aucun résultat</mat-option>
        </mat-autocomplete>
    
  `,
})
export class CustomAutocompleteEditorComponent implements ICellEditorAngularComp {
  @ViewChild('input', { static: true }) input!: ElementRef<HTMLInputElement>;

  private cellValue: any;
  params: any;
  ctrl = new FormControl('');
  options$!: Observable<any[]>;
  loading = false;
  empty = false;

  agInit(params: any): void {
    this.params = {
      minChars: 1,
      pageSize: 30,
      debounceMs: 250,
      optionLabel: (o: any) => String(o),
      optionValue: (o: any) => o,
      ...params
    };
    this.cellValue = params.value ?? null;

    // init champ avec le libellé de la valeur courante
    if (this.cellValue != null) {
      if (typeof this.cellValue === 'object') {
        this.ctrl.setValue(this.params.optionLabel(this.cellValue), { emitEvent: false });
      } else {
        this.ctrl.setValue(String(this.cellValue), { emitEvent: false });
      }
    }

    // flux de recherche
    this.options$ = this.ctrl.valueChanges.pipe(
      startWith(this.ctrl.value ?? ''),
      debounceTime(this.params.debounceMs),
      switchMap((q: string) => {
        const query = (q ?? '').trim();
        if (query.length < this.params.minChars) {
          this.empty = false;
          return of([]);
        }
        this.loading = true;
        return Promise.resolve(this.params.fetchFn(query, 1)) // doit retourner {items,total}
          .then((res: any) => {
            const items = res?.items ?? [];
            this.empty = items.length === 0;
            return items;
          })
          .catch(() => {
            this.empty = true;
            return [];
          })
          .finally(() => (this.loading = false));
      })
    );
  }

  afterGuiAttached(): void {
    setTimeout(() => this.input.nativeElement.select(), 0);
  }

  // valeur renvoyée à la grille
  getValue(): any {
    // si l'utilisateur a choisi une option, on aura stocké optionValue(selected)
    return this.cellValue;
  }

  // sélection depuis la liste
  onSelected(ev: MatAutocompleteSelectedEvent): void {
    const selectedLabel = ev.option.value;
    // retrouver l’objet sélectionné via le label
    // (si tu as beaucoup d’items, stocke l’objet dans [value] au lieu du label)
    this.options$.subscribe(opts => {
      const obj = opts.find((o) => this.params.optionLabel(o) === selectedLabel);
      this.cellValue = this.params.optionValue(obj);
      this.params.api.stopEditing();
    }).unsubscribe();
  }

  // gestion clavier (Enter/Tab = valider, Esc = annuler)
  onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this.params.api.stopEditing(true); // cancel
    }
  }

  // helpers
  label = (o: any) => this.params.optionLabel(o);
}
