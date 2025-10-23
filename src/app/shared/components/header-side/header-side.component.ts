import { Component, OnInit, EventEmitter, Input, ViewChildren, Output, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { commonMaterialModules } from '../../material-imports';
import { ThemeService } from '../../services/theme.service';
import { LayoutService } from '../../services/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { JwtAuthService } from '../../services/auth/jwt-auth.service';
import { SearchModule } from '../../search/search.module';
import { GlobalService } from 'app/shared/services/_ekit/global.service';
import { LocalStoreService } from 'app/shared/services/local-store.service';

@Component({
    selector: 'app-header-side',
    templateUrl: './header-side.template.html',
    standalone: true,
    imports: [
      CommonModule,
      RouterModule,
      ...commonMaterialModules,
      TranslateModule,
      SearchModule
    ]
})
export class HeaderSideComponent implements OnInit {
  @Input() notificPanel;
  public availableLangs = [{
    name: 'FR',
    code: 'fr',
    flag: 'fr'
  },{
    name: 'EN',
    code: 'en',
    flag: 'gb'
  }];
  currentLang = this.availableLangs[0];

  public themes: any[] = [];
  public activeTheme: any;
  public layoutConf: any;
  constructor(
    private themeService: ThemeService,
    private layout: LayoutService,
    public translate: TranslateService,
    private renderer: Renderer2,
    private ls:LocalStoreService,
    public jwtAuth: JwtAuthService,
    private globalService:GlobalService,
  ) {}
  ngOnInit() {
    this.themes = this.themeService.getAvailableThemes();
    this.activeTheme = this.themeService.getActiveTheme();
    this.layoutConf = this.layout.layoutConf;

    // UPDATE APP LANGUAGE CODE
    
    //this.translate.use(lng.code);
    //this.globalService.appLang = lng.code;
    const lang = this.ls.getItem("appLang");
    if (!lang) {
      this.currentLang = this.availableLangs[0];
    } else {
      this.currentLang = this.availableLangs.find(item => (item.code == lang));
    }
    this.globalService.appLang = this.currentLang.code;
    this.translate.use(lang?lang:this.currentLang.code);
  }
  setLang(lng) {
    this.currentLang = lng;
    this.translate.use(lng.code);
    this.globalService.appLang = lng.code;
    this.ls.setItem("appLang", lng.code);
  }
  changeTheme(themeId: string) {
    this.themeService.setActiveThemeById(themeId);
  }
  toggleNotific() {
    this.notificPanel.toggle();
  }
  toggleSidenav() {
    if (this.layoutConf.sidebarStyle === 'closed') {
      return this.layout.publishLayoutChange({
        sidebarStyle: 'full'
      });
    }
    this.layout.publishLayoutChange({
      sidebarStyle: 'closed'
    });
  }

  toggleCollapse() {
    // compact --> full
    if (this.layoutConf.sidebarStyle === 'compact') {
      return this.layout.publishLayoutChange({
        sidebarStyle: 'full',
        sidebarCompactToggle: false
      });
    }

    // * --> compact
    this.layout.publishLayoutChange({
      sidebarStyle: 'compact',
      sidebarCompactToggle: true
    });

  }

  onSearch(e) {
    //   console.log(e)
  }
}
