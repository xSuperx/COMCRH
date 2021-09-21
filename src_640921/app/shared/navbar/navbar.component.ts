import { Component, Output, EventEmitter, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from '../services/layout.service';
import { Subscription } from 'rxjs';
import { ConfigService } from '../services/config.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})

export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  currentLang = "en";
  toggleClass = "ft-maximize";
  placement = "bottom-right";
  //placement = "bottom-left";
  public isCollapsed = true;
  layoutSub: Subscription;
  @Output()
  toggleHideSidebar = new EventEmitter<Object>();
  LoginSub: Subscription;
  LgLogedin: boolean = false;

  public config: any = {};

  UserInfo: any = {
    UsPID : null,
    UsCode : null,
    UsName : null,
    UsPosc : null,
    UsPosn : null,
    UsAdmin : null,
    UsLogin : null
  }

  constructor(
    public translate: TranslateService,
    private layoutService: LayoutService,
    private configService:ConfigService,
    private router: Router,
    private authService: AuthService
  ){
    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|es|pt|de/) ? browserLang : "en");
    this.layoutSub = layoutService.changeEmitted$.subscribe(
      direction => {
        const dir = direction.direction;
        if (dir === "rtl") {
          this.placement = "bottom-left";
        }
        else if (dir === "ltr") {
          this.placement = "bottom-right";
        }
      });
  }

  ngOnInit() {

    this.config = this.configService.templateConf;
    this.LoginSub = this.authService.SubjectLoginChangeEmitted$.subscribe(
      islogin =>{
        this.LgLogedin = islogin;
        //console.log( localStorage );
        if( this.LgLogedin ){
          this.UserInfo.UsPID  = localStorage.getItem('LgUserCode');
          this.UserInfo.UsCode = localStorage.getItem('LgUserCode');
          this.UserInfo.UsName = localStorage.getItem('LgUsrFullName');
          this.UserInfo.UsPosc = localStorage.getItem('LgUsrPosCode');
          this.UserInfo.UsPosn = localStorage.getItem('LgUsrPosName');
          this.UserInfo.UsAdmin = localStorage.getItem('LgUsrAdmin');
          this.UserInfo.UsLogin = "1";
        }
      }
    );

    if(localStorage.getItem('LgLogedin')){
      this.LgLogedin = true;
      this.UserInfo.UsPID  = localStorage.getItem('LgUserCode');
      this.UserInfo.UsCode = localStorage.getItem('LgUserCode');
      this.UserInfo.UsName = localStorage.getItem('LgUsrFullName');
      this.UserInfo.UsPosc = localStorage.getItem('LgUsrPosCode');
      this.UserInfo.UsPosn = localStorage.getItem('LgUsrPosName');
      this.UserInfo.UsAdmin = localStorage.getItem('LgUsrAdmin');
      this.UserInfo.UsLogin = "1";
    }

    //console.log( this.UserInfo );
  }

  ngAfterViewInit() {
    if(this.config.layout.dir) {
      setTimeout(() => {
        const dir = this.config.layout.dir;
        if (dir === "rtl") {
          this.placement = "bottom-left";
        } else if (dir === "ltr") {
          this.placement = "bottom-right";
        }
      }, 0);
    }
  }

  ngOnDestroy() {
    if (this.layoutSub) {
      this.layoutSub.unsubscribe();
    }
  }

  ChangeLanguage(language: string) {
    this.translate.use(language);
  }

  ToggleClass() {
    if (this.toggleClass === "ft-maximize") {
      this.toggleClass = "ft-minimize";
    } else {
      this.toggleClass = "ft-maximize";
    }
  }

  toggleNotificationSidebar() {
    this.layoutService.emitNotiSidebarChange(true);
  }

  toggleSidebar() {
    const appSidebar = document.getElementsByClassName("app-sidebar")[0];
    if (appSidebar.classList.contains("hide-sidebar")) {
      this.toggleHideSidebar.emit(false);
    } else {
      this.toggleHideSidebar.emit(true);
    }
  }

  UserLogin(){
    this.router.navigate(['/userlogin']);
  }

  UserLogout(){
    this.LgLogedin = false;
    this.UserInfo.UsPID  = null;
    this.UserInfo.UsCode = null;
    this.UserInfo.UsName = null;
    this.UserInfo.UsPosc = null;
    this.UserInfo.UsPosn = null;
    this.UserInfo.UsAdmin = null;
    this.UserInfo.UsLogin = null;
    this.authService.logout();
  }
}
