import { Component, OnInit, Input, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppDropdownDirective } from '../../directives/dropdown.directive';
import { DropdownAnchorDirective } from '../../directives/dropdown-anchor.directive';
import { DropdownLinkDirective } from '../../directives/dropdown-link.directive';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.template.html',
    standalone: true,
    imports: [
      CommonModule,
      RouterModule,
      MatIconModule,
      MatButtonModule,
      MatDividerModule,
      MatTooltipModule,
      AppDropdownDirective,
      DropdownAnchorDirective,
      DropdownLinkDirective,
      TranslateModule
    ]
})
export class SidenavComponent {
  private router = inject(Router);

  @Input('items') public menuItems: any[] = [];
  @Input('hasIconMenu') public hasIconTypeMenuItem: boolean;
  @Input('iconMenuTitle') public iconTypeMenuTitle: string;
  @ViewChild('sidenav') sidenav:ElementRef;
  


  constructor() {
      
  }
  ngOnInit() {
  }
  ngAfterViewInit() {}

  loadProject(uid) {
    //ON LOAD LE PROJET SELECTIONNE
    this.router.navigate(["/ekit/tables/"+uid]);
  }

}