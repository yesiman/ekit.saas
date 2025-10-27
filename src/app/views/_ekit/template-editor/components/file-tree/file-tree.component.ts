import { Component, EventEmitter, Output } from '@angular/core';
import { FilesService } from '../../services/files.service';
import { FileDoc, FileNode } from '../../models/file.types';
import { CommonModule, AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { TemplatingApisService } from 'app/shared/services/_ekit/templating.apis.service';
@Component({
  selector: 'app-file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss'],
  imports: [CommonModule],
})
export class FileTreeComponent {

  public tree$;
  expanded = new Set<string>();
  selectedId?: string;

  @Output() open = new EventEmitter<string>();
  @Output() createFile = new EventEmitter<{parentId: string}>();
  @Output() rename = new EventEmitter<{id: string, name: string}>();

  constructor(private files: FilesService,private templatingFileApis:TemplatingApisService) {
    

  }

  async ngOnInit() {
    const tree:any = await this.files.getTree();
    this.tree$ = tree.tree.children;
  }

  toggle(node: FileNode) {
    if (node.kind === 'folder') {
      this.expanded.has(node.id) ? this.expanded.delete(node.id) : this.expanded.add(node.id);
    } else {
      console.log("node",node);
      this.selectedId = node.id;
      this.open.emit((node as any).path);
    }
  }
}
