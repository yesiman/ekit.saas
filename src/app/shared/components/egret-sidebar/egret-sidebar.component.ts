import {
  Component,
  OnInit,
  Input,
  HostBinding,
  OnDestroy,
  HostListener,
  Directive,
  Renderer2,
  ElementRef,
  ChangeDetectorRef
} from "@angular/core";
// import { MatchMediaService } from "app/shared/services/match-media.service";
// import { MediaObserver } from "@angular/flex-layout";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { EgretSidebarHelperService } from "./egret-sidebar-helper.service";
import { BreakpointObserver } from "@angular/cdk/layout";

@Component({
  selector: "egret-sidebar",
  templateUrl: "./egret-sidebar.component.html",
  styleUrls: ["./egret-sidebar.component.scss"],
  standalone: false
})
export class EgretSidebarComponent implements OnInit, OnDestroy {
  // Name
  @Input()
  name: string;

  // right
  @Input()
  @HostBinding("class.position-right")
  right: boolean;

  // Open
  @HostBinding("class.open")
  @Input()
  opened: boolean;

  @HostBinding("class.sidebar-locked-open")
  sidebarLockedOpen: boolean;

  //mode
  @HostBinding("class.is-over")
  isOver: boolean;
  isMobile: boolean;
  private backdrop: HTMLElement | null = null;

  private lockedBreakpoint = "(min-width: 960px)";
  private unsubscribeAll: Subject<any>;

  constructor(
    // private matchMediaService: MatchMediaService,
    // private mediaObserver: MediaObserver,
    private sidebarHelperService: EgretSidebarHelperService,
    private _renderer: Renderer2,
    private _elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver
  ) {
    this.unsubscribeAll = new Subject();
    this.isMobile = false;
  }

  ngOnInit() {
    this.sidebarHelperService.setSidebar(this.name, this);
    this.breakpointObserver
      .observe(this.lockedBreakpoint)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((state: any) => {
        this.isMobile = !state.matches;
        // this.sidebarLockedOpen = state.matches;
        this.opened = state.matches;
      });
  }

  open() {
    this.opened = true;
    if (!this.sidebarLockedOpen && !this.backdrop) {
      this.showBackdrop();
    }
  }

  close() {
    this.opened = false;
    this.hideBackdrop();
  }

  toggle() {
    if (this.opened) {
      this.close();
    } else {
      this.open();
    }
  }

  showBackdrop() {
    if (!this.isMobile) {
      return;
    }
    this.backdrop = this._renderer.createElement("div");
    this.backdrop.classList.add("egret-sidebar-overlay");

    this._renderer.appendChild(
      this._elementRef.nativeElement.parentElement,
      this.backdrop
    );

    // Close sidebar onclick
    this.backdrop.addEventListener("click", () => {
      this.close();
    });

    this.cdr.markForCheck();
  }

  hideBackdrop() {
    if (this.backdrop) {
      this.backdrop.parentNode.removeChild(this.backdrop);
      this.backdrop = null;
    }

    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(1);
    this.unsubscribeAll.complete();
    this.sidebarHelperService.removeSidebar(this.name);
  }
}

@Directive({
  selector: "[egretSidebarToggler]",
  standalone: false
})
export class EgretSidebarTogglerDirective {
  @Input("egretSidebarToggler")
  public id: any;

  constructor(private egretSidebarHelperService: EgretSidebarHelperService) { }

  @HostListener("click")
  onClick() {
    this.egretSidebarHelperService.getSidebar(this.id).toggle();
  }
}
