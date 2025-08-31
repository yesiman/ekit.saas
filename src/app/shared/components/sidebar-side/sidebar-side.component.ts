import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { NavigationService } from "../../../shared/services/navigation.service";
import { ThemeService } from "../../services/theme.service";
import { map, catchError, delay } from "rxjs/operators";
import { ILayoutConf, LayoutService } from "app/shared/services/layout.service";
import { JwtAuthService } from "app/shared/services/auth/jwt-auth.service";
import { TranslateModule } from "@ngx-translate/core";
import { SidenavComponent } from "../sidenav/sidenav.component";
import { PerfectScrollbarModule } from "app/shared/components/perfect-scrollbar";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { Subscription, throwError } from "rxjs";

@Component({
    selector: "app-sidebar-side",
    templateUrl: "./sidebar-side.component.html",
    standalone: true,
    imports: [
      CommonModule,
      RouterModule,
      MatIconModule,
      MatButtonModule,
      MatMenuModule,
      TranslateModule,
      SidenavComponent,
      PerfectScrollbarModule
    ]
})
export class SidebarSideComponent implements OnInit, OnDestroy, AfterViewInit {
  public menuItems: any[];
  public hasIconTypeMenuItem: boolean;
  public iconTypeMenuTitle: string;
  private menuItemsSub: Subscription;
  public layoutConf: ILayoutConf;
  @ViewChild('sidenav') sidenav:any;

  constructor(
    private navService: NavigationService,
    public themeService: ThemeService,
    private layout: LayoutService,
    public jwtAuth: JwtAuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.iconTypeMenuTitle = this.navService.iconTypeMenuTitle;
    // EKIT 
    // SI PAS DE PROJET SELECTIONNE
    // ON VA LOADER LES PROJET DE L'UTILISATEUR POUR SELECTION
    // A PASSER DANS LE SERVICE EKIT AVEC observable
    this.http.post(`${environment.apiURL}/projects/get`, { a:"b" })
      .pipe(
        map((res: any) => {
          return res.result.map(item => ({
                name: item.name,
                type: "link",
                icon:"list"
          }));
        }),
        catchError((error) => {
          console.log(error);
          return throwError(error);
        })
    ).subscribe((data) => {
      //Création de la liste des projets
      this.menuItems = [  
          {
            name: "Projects",
            type: "separator",
            icon:"list",
            addMoreButton:true
          },
          ...data
        ];
        //A VIRER
        this.menuItemsSub = this.navService.menuItems$.subscribe(menuItem => {
          console.log("menuItem",menuItem);
          this.menuItems = [...this.menuItems,...menuItem];
          //Checks item list has any icon type.
          this.hasIconTypeMenuItem = !!this.menuItems.filter(
            item => item.type === "icon"
          ).length;
        });
    });



    
    this.layoutConf = this.layout.layoutConf;
  }
  ngAfterViewInit() {
    setTimeout(() => {
      const links = this.sidenav.sidenav.nativeElement.querySelectorAll('li[appdropdownlink]');
      [...links].forEach(link => {
        if(link.querySelector('a.open')) {
          // Add open class
          link.classList.add('open');
          // Scroll into view if not in view
          const rect = link.getBoundingClientRect();
          const inView = (rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth);
          if (!inView) {
            link.scrollIntoView();
          }
        }
      })
    }, 50)
  }
  ngOnDestroy() {
    if (this.menuItemsSub) {
      this.menuItemsSub.unsubscribe();
    }
  }
  toggleCollapse() {
    if (
      this.layoutConf.sidebarCompactToggle
    ) {
        this.layout.publishLayoutChange({
        sidebarCompactToggle: false
      });
    } else {
        this.layout.publishLayoutChange({
            // sidebarStyle: "compact",
            sidebarCompactToggle: true
          });
    }
  }
}
