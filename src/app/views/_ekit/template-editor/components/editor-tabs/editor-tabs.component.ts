import { Component, NgZone } from '@angular/core';
import { FilesService } from '../../services/files.service';
import { FileDoc } from '../../models/file.types';
import { Subject, debounceTime } from 'rxjs';
import { CommonModule, AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import * as monaco from 'monaco-editor';

interface Tab { id: string; doc: FileDoc; dirty: boolean; }

@Component({
  selector: 'app-editor-tabs',
  templateUrl: './editor-tabs.component.html',
  styleUrls: ['./editor-tabs.component.scss'],
  imports: [
    CommonModule,
    MonacoEditorModule,
  ],
})
export class EditorTabsComponent {
  tabs: Tab[] = [];
  activeId?: string;
  code = 'console.log("hello")';
  // autosave “propre”
  private contentChange$ = new Subject<{id: string, content: string}>();
  private editor?: monaco.editor.IStandaloneCodeEditor;
  private ro?: ResizeObserver;

  editorOptionsBase = {
    theme: 'vs',
    language: 'plaintext',
    automaticLayout: true,
    minimap: { enabled: false },
    wordWrap: 'on',
    tabSize: 2,

    formatOnPaste: false,
    formatOnType: false,
    autoIndent: 'none',
    quickSuggestions: false,
    suggestOnTriggerCharacters: false
  };

  constructor(private files: FilesService,private ngZone: NgZone) {
    this.contentChange$.pipe(debounceTime(600)).subscribe(({id, content}) => this.save(id, content));
  }

  

  editorOptionsFor(lang?: string) {
    return { ...this.editorOptionsBase, language: lang || 'plaintext' };
  }
    
  openFile(id: string) {
    
    this.files.openFile(id).subscribe(doc => {
      const exists = this.tabs.find(t => t.id === doc.id);
      
      if (exists) { this.activeId = exists.id; return; }
      this.tabs.push({ id: doc.id, doc, dirty: false });
      this.activeId = doc.id;
      this.editorOptionsBase = { ...this.editorOptionsBase, language: doc.language };
    });
  }

  onChange(tab: Tab, content: string) {
    tab.dirty = true;
    tab.doc.content = content;
    this.contentChange$.next({ id: tab.id, content });
  }

  save(id: string, content: string) {
    const tab = this.tabs.find(t => t.id === id);
    if (!tab) return;
    this.files.saveFile({ id, content, version: tab.doc.version }).subscribe({
      next: saved => { tab.doc = saved; tab.dirty = false; },
      error: (err) => {
        if (String(err?.message) === 'version_conflict') {
          alert('Conflit de version — recharger/merger nécessaire.');
        } else {
          console.error(err);
        }
      }
    });
  }

  close(id: string) {
    this.tabs = this.tabs.filter(t => t.id !== id);
    if (this.activeId === id) this.activeId = this.tabs[0]?.id;
  }

  onEditorInit(ed: monaco.editor.IStandaloneCodeEditor) {
    this.editor = ed;

    this.ngZone.runOutsideAngular(() => {
      // Donne la valeur initiale **une seule fois**
      ed.setValue(this.code ?? '');

      // Ecouter les changements sans boucler
      let pending = false;
      ed.onDidChangeModelContent(() => {
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
          pending = false;
          const v = ed.getValue();
          // Si besoin d’updater l’état Angular :
          this.ngZone.run(() => { this.code = v; });
        });
      });

      // Resize (puisqu’on a automaticLayout:false)
      this.ro = new ResizeObserver(() => ed.layout());
      this.ro.observe(ed.getContainerDomNode());
    });
  }

  ngOnDestroy() {
    this.ro?.disconnect();
    this.editor?.dispose();
  }
}
