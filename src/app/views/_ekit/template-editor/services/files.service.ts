import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { FileNode, FileDoc } from '../models/file.types';

@Injectable({ providedIn: 'root' })
export class FilesService {
  private tree$ = new BehaviorSubject<FileNode[]>([
    { id: 'root-1', name: 'templates', kind: 'folder', parentId: null, children: [
      { id: 'f-1', name: 'blog.hbs', kind: 'file', parentId: 'root-1' },
      { id: 'f-2', name: 'layout.hbs', kind: 'file', parentId: 'root-1' },
    ]},
    { id: 'root-2', name: 'partials', kind: 'folder', parentId: null, children: [] },
  ]);

  private docs = new Map<string, FileDoc>([
    ['f-1', { id:'f-1', path:'templates/blog.hbs', name:'blog.hbs', language:'handlebars',
      content:'---\n# front-matter…\n---\n<h1>Hi</h1>', version:1, updatedAt:new Date().toISOString() }],
    ['f-2', { id:'f-2', path:'templates/layout.hbs', name:'layout.hbs', language:'handlebars',
      content:'<!doctype html>\n<html>\n<body>{{{body}}}</body>\n</html>', version:3, updatedAt:new Date().toISOString() }],
  ]);

  getTree(): Observable<FileNode[]> { return this.tree$.asObservable(); }

  openFile(id: string): Observable<FileDoc> {
    const doc = this.docs.get(id);
    if (!doc) return throwError(() => new Error('Not found'));
    // simulate latency
    return of({ ...doc }).pipe(delay(80));
  }

  saveFile(patch: Pick<FileDoc, 'id'|'content'|'version'>): Observable<FileDoc> {
    const current = this.docs.get(patch.id);
    if (!current) return throwError(() => new Error('Not found'));

    // conflit de version
    if (patch.version !== current.version) {
      return throwError(() => new Error('version_conflict'));
    }
    const next: FileDoc = {
      ...current,
      content: patch.content,
      version: current.version + 1,
      updatedAt: new Date().toISOString(),
    };
    this.docs.set(next.id, next);
    return of({ ...next }).pipe(delay(80));
  }

  createFile(parentFolderId: string, name: string): Observable<FileNode> {
    const id = uuid();
    const node: FileNode = { id, name, kind:'file', parentId: parentFolderId };
    const tree = structuredClone(this.tree$.value);
    const parent = this.findNode(tree, parentFolderId);
    parent?.children?.push(node);
    this.tree$.next(tree);
    this.docs.set(id, {
      id, path: `${parent?.name}/${name}`, name, language: this.detectLanguage(name),
      content: '', version: 1, updatedAt: new Date().toISOString()
    });
    return of(node);
  }

  rename(nodeId: string, newName: string): void {
    const tree = structuredClone(this.tree$.value);
    const node = this.findNode(tree, nodeId);
    if (node) node.name = newName;
    this.tree$.next(tree);
  }

  private findNode(nodes: FileNode[], id: string): FileNode | undefined {
    for (const n of nodes) {
      if (n.id === id) return n;
      if (n.children) {
        const f = this.findNode(n.children, id);
        if (f) return f;
      }
    }
    return undefined;
  }

  private detectLanguage(name: string): string {
    const ext = name.split('.').pop();
    switch (ext) {
      case 'hbs': return 'handlebars';
      case 'ts': return 'typescript';
      case 'js': return 'javascript';
      case 'json': return 'json';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'md': return 'markdown';
      case 'yml':
      case 'yaml': return 'yaml';
      default: return 'plaintext';
    }
  }
}
