import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  Input,
  ViewChildren
} from "@angular/core";
import { UntypedFormControl, ReactiveFormsModule } from "@angular/forms";
import { Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { SearchService } from "../search.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AutoFocusDirective } from "app/shared/directives/auto-focus.directive";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { SharedDirectivesModule } from "app/shared/directives/shared-directives.module";

@Component({
    selector: "egret-search-input-over",
    templateUrl: "./search-input-over.component.html",
    styleUrls: ["./search-input-over.component.scss"],
    standalone: true,
    imports: [
      CommonModule,
      ReactiveFormsModule,
      MatButtonModule,
      MatIconModule,
      SharedDirectivesModule
    ]
})
export class SearchInputOverComponent implements OnInit, OnDestroy {
  isOpen: boolean;
  @ViewChildren(AutoFocusDirective) searchInput;
  @Input('resultPage') resultPage: string;
  @Input('placeholder') placeholder: string = "Search here";
  @Output("search") search = new EventEmitter();
  searchCtrl = new UntypedFormControl();
  searchCtrlSub: Subscription;
  constructor(
      private searchService: SearchService,
      private router: Router
  ) {}

  ngOnInit() {
    this.searchCtrl.valueChanges.pipe(debounceTime(200))
    .subscribe(value => {
      this.search.emit(value);
      this.searchService.searchTerm.next(value);
    });
  }

  ngOnDestroy() {
    if (this.searchCtrlSub) {
      this.searchCtrlSub.unsubscribe();
    }
  }
  navigateToResult() {
    if(this.resultPage) {
        this.router.navigateByUrl(this.resultPage);
    }
  }
  open() {
    this.isOpen = true;
    this.navigateToResult();

    setTimeout(() => {
      this.searchInput.first.focus();
    })
  }
  close() {
    this.isOpen = false;
  }
  toggle() {
    this.isOpen = !this.isOpen;
  }
}
