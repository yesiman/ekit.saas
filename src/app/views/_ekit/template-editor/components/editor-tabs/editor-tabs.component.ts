import { Component, NgZone, SimpleChanges } from '@angular/core';
import { FilesService } from '../../services/files.service';
import { FileDoc } from '../../models/file.types';
import { Subject, debounceTime } from 'rxjs';
import { CommonModule, AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import * as monaco from 'monaco-editor';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


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
  mode:string = "code";
  activeId?: string;
  code = 'console.log("hello")';

  safeUrl?: SafeResourceUrl;
  loading = true;

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

  constructor(private files: FilesService,private ngZone: NgZone,private sanitizer: DomSanitizer) {
    //this.contentChange$.pipe(debounceTime(600)).subscribe(({id, content}) => this.save(id, content));
  }

  

  editorOptionsFor(lang?: string) {
    return { ...this.editorOptionsBase, language: lang || 'plaintext' };
  }
    //http://localhost:8700/api/render/klmkml
  async openFile(path: string) {
    
    const doc:any = await this.files.openFile(path);
    //console.log("filez",file);
    this.mode = "code";
    const exists = this.tabs.find(t => t.id === path);
    this.code = doc.content;
    if (exists) { this.activeId = exists.id; return; }
    this.tabs.push({ id: path, doc, dirty: false });
    this.activeId = path;
    this.editorOptionsBase = { ...this.editorOptionsBase, language: "handlebars" };
    
  }

  async saveFile() {
    //console.log("path",path);
    const tab = this.tabs.find(t => t.id === this.activeId);
    if (!tab) return;
    const value = this.editor?.getValue() ?? '';
    //console.log(value);
    //console.log(tab.doc);

    const doc:any = await this.files.saveFile(this.activeId,value);

  }

  async showPreview(j) {
    this.mode = "preview";
  }
  onChange(tab: Tab, content: string) {
    tab.dirty = true;
    tab.doc.content = content;
    this.contentChange$.next({ id: tab.id, content });
  }

  /*save(id: string, content: string) {
    console.log("in save");
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
  }*/

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

  ngOnChanges(_: SimpleChanges) {
    this.buildUrl();      // recalcul si id/params changent
  }

  reload() {
    this.buildUrl(true);  // force refresh (cache-busting)
  }

  private buildUrl(bust = false) {
    //if (!this.templateId) return;
    this.loading = true;
    const base = "http://localhost:8700/api/templates/render/klmkml";
    //const base = `/render/${encodeURIComponent(this.templateId)}`;
    const qs: Record<string,string> = { preview: '1' };
    //if (this.params) qs.params = encodeURIComponent(JSON.stringify(this.params));
    if (bust) qs.ts = String(Date.now());

    const query = null;//Object.entries(qs).map(([k,v]) => `${k}=${v}`).join('&');
    //const url = `${base}?${query}`;
    const url = `${base}`;
    
    // SafeResourceUrl (évite les erreurs de sécurité Angular)
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  onIframeLoad() {
    // petit délai pour laisser la page se stabiliser
    this.ngZone.runOutsideAngular(() => setTimeout(() => {
      this.ngZone.run(() => this.loading = false);
    }, 100));
  }

  ngOnInit() {
    this.buildUrl();
  }
  ngOnDestroy() {
    this.ro?.disconnect();
    this.editor?.dispose();
  }
}
