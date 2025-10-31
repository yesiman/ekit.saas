import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-template-editor',
  templateUrl: './template-editor.component.html',
  styleUrl: './template-editor.component.scss',
  standalone:false
  
})
export class TemplateEditorComponent {
  private route = inject(ActivatedRoute);
  templateuid;

  constructor(private _location: Location) {

  }

  ngOnInit() {
    this.route.params.subscribe(routeParams => {
      //
      this.templateuid = routeParams.templateuid;
	  });
  }

  //agGridTheme = this.themeService.agGridTheme;
  /**
   * 
   */
  navBack() {
    this._location.back();
  }
}
