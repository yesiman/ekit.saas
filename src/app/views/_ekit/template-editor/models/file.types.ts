export type FileKind = 'file' | 'folder';

export interface FileNode {
  id: string;
  name: string;
  kind: FileKind;
  parentId?: string | null;
  children?: FileNode[];
}

export interface FileDoc {
  id: string;
  path: string;     // ex: "templates/blog.hbs"
  name: string;     // "blog.hbs"
  language: string; // "handlebars","html","css","typescript","json", etc.
  content: string;
  version: number;  // pour détection de conflits
  updatedAt: string;
}