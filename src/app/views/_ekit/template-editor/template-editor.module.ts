import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TemplateEditorComponent } from "./template-editor.component";
import { TemplateEditorRoutes } from "./template-editor.routing";
import { FileTreeComponent } from "./components/file-tree/file-tree.component";
import { EditorTabsComponent } from "./components/editor-tabs/editor-tabs.component";

@NgModule({
  imports: [
      FileTreeComponent,
      EditorTabsComponent,
      RouterModule.forChild(TemplateEditorRoutes)
    ],
    declarations: [TemplateEditorComponent]
})
export class TemplateEditorModule {}
