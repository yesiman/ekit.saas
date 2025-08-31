import { Directive, HostListener, Inject } from '@angular/core';
import { DropdownLinkDirective } from './dropdown-link.directive';

@Directive({
    selector: '[appDropdownToggle]',
    standalone: true
})
export class DropdownAnchorDirective {
  protected navlink: DropdownLinkDirective;

  constructor(@Inject(DropdownLinkDirective) navlink: DropdownLinkDirective) {
    this.navlink = navlink;
  }

  @HostListener('click', ['$event'])
  onClick(e: any) {
    // console.log(this.navlink)
    this.navlink.toggle();
  }
}
