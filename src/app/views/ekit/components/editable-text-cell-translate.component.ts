import { Component } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'editable-text-cell-translate',
  imports: [
    FormsModule
  ],
  template: `
    <div class="editor-container">
      <input 
        name="kkk" 
        type="text"
        [(ngModel)]="value"
        class="editor-input"
      />
      <button type="button" class="icon-btn" (click)="togglePopup($event)">
        🔍
      </button>

      
    </div>
  `,
  styles: [`
    .editor-container {
      display: flex;
      align-items: center;
      position: relative;
      width: 100%;
    }
    .editor-input {
      flex: 1;
      padding-right: 30px;
    }
    .icon-btn {
      position: absolute;
      right: 5px;
      border: none;
      background: transparent;
      cursor: pointer;
    }
    .popup {
      position: absolute;
      z-index:999999999;
      top: 100%;
      right: 0;
      background: #c1a2a2ff;
      border: 1px solid #ccc;
      padding: 8px;
      z-index: 1000;
      min-width: 150px;
    }
  `]
})
export class EditableTextCellTranslate implements ICellEditorAngularComp {
  private params: any;
  public value: any;
  private popupDiv: HTMLDivElement | null = null;

  agInit(params: any): void {
    this.params = params;
    this.value = this.params.value;
  }

  getValue(): any {
    return this.value;
  }

  togglePopup(event: Event): void {
    event.stopPropagation(); // pour éviter que AG Grid ferme l’éditeur
    if (this.popupDiv) {
      this.closePopup();
      return;
    }

    // Créer le popup
    this.popupDiv = document.createElement('div');
    this.popupDiv.style.position = 'absolute';
    this.popupDiv.style.background = 'white';
    this.popupDiv.style.border = '1px solid #ccc';
    this.popupDiv.style.padding = '10px';
    this.popupDiv.style.zIndex = '10000';
    this.popupDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';

    this.popupDiv.innerHTML = `
      <p>Options pour: ${this.value}</p>
      <button id="optionA">Option A</button>
      <button id="optionB">Option B</button>
      <button id="closePopup">Fermer</button>
    `;

    document.body.appendChild(this.popupDiv);

    // Positionner le popup par rapport au bouton
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    this.popupDiv.style.top = rect.bottom + 'px';
    this.popupDiv.style.left = rect.left + 'px';

    // Gestion des clics
    this.popupDiv.querySelector('#optionA')?.addEventListener('click', () => {
      this.value = 'Option A';
      this.closePopup();
    });
    this.popupDiv.querySelector('#optionB')?.addEventListener('click', () => {
      this.value = 'Option B';
      this.closePopup();
    });
    this.popupDiv.querySelector('#closePopup')?.addEventListener('click', () => {
      this.closePopup();
    });

    // Fermer le popup si clic à l'extérieur
    const clickListener = (e: MouseEvent) => {
      if (this.popupDiv && !this.popupDiv.contains(e.target as Node) && e.target !== event.target) {
        this.closePopup();
        document.removeEventListener('click', clickListener);
      }
    };
    document.addEventListener('click', clickListener);
  }

  

  closePopup() {
    if (this.popupDiv) {
      this.popupDiv.remove();
      this.popupDiv = null;
    }
  }
  
}