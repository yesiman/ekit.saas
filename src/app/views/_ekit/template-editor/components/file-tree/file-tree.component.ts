import { Component, EventEmitter, Output } from '@angular/core';
import { FilesService } from '../../services/files.service';
import { FileDoc, FileNode } from '../../models/file.types';
import { CommonModule, AsyncPipe, NgForOf, NgIf } from '@angular/common';
@Component({
  selector: 'app-file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss'],
  imports: [CommonModule],
})
export class FileTreeComponent {
  tree$ = this.files.getTree();
  expanded = new Set<string>();
  selectedId?: string;

  @Output() open = new EventEmitter<string>();
  @Output() createFile = new EventEmitter<{parentId: string}>();
  @Output() rename = new EventEmitter<{id: string, name: string}>();

  constructor(private files: FilesService) {}

  toggle(node: FileNode) {
    if (node.kind === 'folder') {
      this.expanded.has(node.id) ? this.expanded.delete(node.id) : this.expanded.add(node.id);
    } else {
      this.selectedId = node.id;
      this.open.emit(node.id);
    }
  }
}
