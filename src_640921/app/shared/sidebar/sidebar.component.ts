import { Component, OnInit, Input, ViewChild, OnDestroy, ElementRef, Renderer2, AfterViewInit } from "@angular/core";
import { RouteInfo } from "./sidebar.metadata";
import { Router, ActivatedRoute } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import { customAnimations } from "../animations/custom-animations";
import { ConfigService } from '../services/config.service';
import { LayoutService } from '../services/layout.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ['./sidebar.component.scss'],
  animations: customAnimations
})

export class SidebarComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('toggleIcon') toggleIcon: ElementRef;
  public menuItems: any[];
  depth: number;
  activeTitle: string;
  activeTitles: string[] = [];
  expanded: boolean;
  nav_collapsed_open = false;
  logoUrl = 'assets/img/logoCom.png';
  public config: any = {};
  layoutSub: Subscription;
  LoginSub: Subscription;

  UserInfo: any = {
    UsPID:'-',
    UsCode:'-',
    UsName:'-',
    UsPosc:'-',
    UsPosn:'-',
    UsAdmin:'-',
    UsLogin:'-'
  }

  Menu_NoLogin : RouteInfo[] = [
    { path:'/feedback' ,title:'เสนอแนะเพื่อพัฒนา' ,icon:'ft-message-circle' ,class:'' ,badge:'' ,badgeClass:'' ,isExternalLink: false ,submenu: [] },
    { path:'/deptnotified' ,title:'แจ้งปัญหาคอมฯ' ,icon:'ft-command' ,class:'' ,badge:'' ,badgeClass:'' ,isExternalLink: false ,submenu: [] },
    { path:'/reqapp' ,title:'ขอสร้างโปรแกรม' ,icon:'ft-codepen' ,class:'' ,badge:'' ,badgeClass:'' ,isExternalLink: false ,submenu: [] },
    { path:'/reqcom' ,title:'ขอสนับสนุนคอมฯ' ,icon:'ft-cpu' ,class:'' ,badge:'' ,badgeClass:'' ,isExternalLink: false ,submenu: [] },
    { path:'/reqrep' ,title:'ขอสนับสนุนรายงาน' ,icon:'ft-layers' ,class:'' ,badge:'' ,badgeClass:'' ,isExternalLink: false ,submenu: [] },
    //{ path:'/userlogin' ,title:'ตรวจสอบสิทธิ์/เข้าสู่ระบบ' ,icon:'ft-log-in' ,class:'' ,badge:'' ,badgeClass:'' ,isExternalLink: false ,submenu: [] },
    //{ path:'/infopanel' ,title:'รายการประจำวัน' ,icon:'ft-clipboard' ,class:'' ,badge:'' ,badgeClass:'' ,isExternalLink: false ,submenu: [] },
    //{ path:'/report2' ,title:'รายงานสถิติ' ,icon:'ft-pie-chart' ,class:'' ,badge:'' ,badgeClass:'' ,isExternalLink: false ,submenu: [] }
    //{ path:'/reports' ,title:'รายงานสถิติ' ,icon:'ft-pie-chart' ,class:'' ,badge:'' ,badgeClass:'' ,isExternalLink: false ,submenu: [] }
  ];

  Menu_Logedin : RouteInfo[] = [
    { path: '/infopanel', title: 'หน้าหลัก', icon: 'ft-clipboard', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    { path: '/activities', title: 'บันทึกประจำวัน', icon: 'ft-codepen', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    { path: '/reqanswer', title: 'คำแนะนำ-ขอสนับสนุน', icon: 'ft-inbox', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //{ path: '/reqapp', title: 'ขอจัดสร้างระบบ', icon: 'ft-layers', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    { path: '/report2', title: 'รายงานสถิติ', icon: 'ft-pie-chart', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //{ path: '/servicelog', title: 'บันทึกกิจกรรมบริการ', icon: 'ft-command', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //{ path: '/risk', title: 'ทะเบียนความเสี่ยง', icon: 'ft-alert-triangle', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //{ path: '/reports', title: 'รายงานสถิติ', icon: 'ft-pie-chart', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
  ];

  Menu_ForAdmin : RouteInfo[] = [
    { path: '/infopanel', title: 'หน้าหลัก', icon: 'ft-clipboard', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    { path: '/activities', title: 'บันทึกประจำวัน', icon: 'ft-codepen', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    { path: '/reqanswer', title: 'คำแนะนำ-ขอสนับสนุน', icon: 'ft-inbox', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //{ path: '/reqapp', title: 'ขอจัดสร้างระบบ', icon: 'ft-layers', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    { path: '/appsetup', title: 'กำหนดค่าในระบบ', icon: 'ft-settings', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    { path: '/report2', title: 'รายงานสถิติ', icon: 'ft-pie-chart', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //{ path: '/reports', title: 'รายงานสถิติ', icon: 'ft-pie-chart', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //{ path: '/servicelog', title: 'บันทึกกิจกรรมบริการ', icon: 'ft-command', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //{ path: '/risk', title: 'ทะเบียนความเสี่ยง', icon: 'ft-alert-triangle', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
  ];

  LgLogedin: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService,
    private configService: ConfigService,
    private layoutService: LayoutService,
    private authService: AuthService
  )
  {

    if (this.depth === undefined) {
      this.depth = 0;
      this.expanded = true;
    }

    this.layoutSub = layoutService.customizerChangeEmitted$.subscribe(
      options => {
        if (options) {
          if (options.bgColor) {
            if (options.bgColor === 'white') {
              //this.logoUrl = 'assets/img/logo-dark.png';
              this.logoUrl = 'assets/img/logoCom.png';
            }
            else {
              this.logoUrl = 'assets/img/logoCom.png';
            }
          }

          if (options.compactMenu === true) {
            this.expanded = false;
            this.renderer.addClass(this.toggleIcon.nativeElement, 'ft-toggle-left');
            this.renderer.removeClass(this.toggleIcon.nativeElement, 'ft-toggle-right');
            this.nav_collapsed_open = true;
          }
          else if (options.compactMenu === false) {
            this.expanded = true;
            this.renderer.removeClass(this.toggleIcon.nativeElement, 'ft-toggle-left');
            this.renderer.addClass(this.toggleIcon.nativeElement, 'ft-toggle-right');
            this.nav_collapsed_open = false;
          }

        }
      }
    );


  }

  ngOnInit() {
    this.config = this.configService.templateConf;
    this.LoginSub = this.authService.SubjectLoginChangeEmitted$.subscribe(
      islogin =>{
        this.LgLogedin = islogin;
        //console.log( localStorage );
        if( this.LgLogedin )
        {
          //console.log( localStorage );
          var ChkUsName = localStorage.getItem( 'LgUsrFullName' );
          var ChkUsPos = localStorage.getItem( 'LgUsrPosCode' );
          if( ChkUsName === 'undefined' ){ ChkUsName = "-"; }
          else if( ChkUsName == "" ){ ChkUsName = "-"; }
          if( ChkUsPos === 'undefined' ){ ChkUsPos = "-"; }
          else if( ChkUsPos == "" ){ ChkUsPos = "-"; }
          //console.log( "ChkUsName=" + ChkUsName +", ChkUsPos="+ ChkUsPos );

          if( ChkUsName != "-" && ChkUsPos != "-" ){
          // if( ChkUsName !== 'undefined' && ChkUsPos !== 'undefined' ){
            this.UserInfo.UsPID  = localStorage.getItem('LgUserCode');
            this.UserInfo.UsCode = localStorage.getItem('LgUserCode');
            this.UserInfo.UsName = localStorage.getItem('LgUsrFullName');
            this.UserInfo.UsPosc = localStorage.getItem('LgUsrPosCode');
            this.UserInfo.UsPosn = localStorage.getItem('LgUsrPosName');
            this.UserInfo.UsAdmin = localStorage.getItem('LgUsrAdmin');
            this.UserInfo.UsLogin = "1";
            //console.log( this.UserInfo );
            if( this.UserInfo.UsAdmin=="Y" ){
              this.menuItems = this.Menu_ForAdmin;
            }
            else{
              this.menuItems = this.Menu_Logedin;
            }
          }else{
            this.menuItems = this.Menu_NoLogin;
          }
        }
        else{
          this.UserInfo.UsPID  = "-";
          this.UserInfo.UsCode = "-";
          this.UserInfo.UsName = "-";
          this.UserInfo.UsPosc = "-";
          this.UserInfo.UsPosn = "-";
          this.UserInfo.UsAdmin = "-";
          this.UserInfo.UsLogin = "-";
          this.menuItems = this.Menu_NoLogin;
        }
      }
    );

    if (this.config.layout.sidebar.backgroundColor === 'white') {
      //this.logoUrl = 'assets/img/logo-dark.png';
      this.logoUrl = 'assets/img/logoCom.png';
    }
    else {
      this.logoUrl = 'assets/img/logoCom.png';
    }

    if(localStorage.getItem('LgLogedin')){
      this.LgLogedin = true;
      this.UserInfo.UsPID  = localStorage.getItem('LgUserCode');
      this.UserInfo.UsCode = localStorage.getItem('LgUserCode');
      this.UserInfo.UsName = localStorage.getItem('LgUsrFullName');
      this.UserInfo.UsPosc = localStorage.getItem('LgUsrPosCode');
      this.UserInfo.UsPosn = localStorage.getItem('LgUsrPosName');
      this.UserInfo.UsAdmin = localStorage.getItem('LgUsrAdmin');
      this.UserInfo.UsLogin = "1";
      //console.log( this.UserInfo );
      if(this.UserInfo.UsAdmin=="Y"){
        this.menuItems = this.Menu_ForAdmin;
      }
      else{
        this.menuItems = this.Menu_Logedin;
      }
    }
    else{
      this.LgLogedin = false;
      this.menuItems = this.Menu_NoLogin;
    }
  }

  UserLogout(){
    this.authService.logout();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.config.layout.sidebar.collapsed != undefined) {
        if (this.config.layout.sidebar.collapsed === true) {
          this.expanded = false;
          this.renderer.addClass(this.toggleIcon.nativeElement, 'ft-toggle-left');
          this.renderer.removeClass(this.toggleIcon.nativeElement, 'ft-toggle-right');
          this.nav_collapsed_open = true;
        }
        else if (this.config.layout.sidebar.collapsed === false) {
          this.expanded = true;
          this.renderer.removeClass(this.toggleIcon.nativeElement, 'ft-toggle-left');
          this.renderer.addClass(this.toggleIcon.nativeElement, 'ft-toggle-right');
          this.nav_collapsed_open = false;
        }
      }
    }, 0);
  }

  ngOnDestroy() {
    if (this.layoutSub) {
      this.layoutSub.unsubscribe();
    }
  }

  toggleSlideInOut() {
    this.expanded = !this.expanded;
  }

  handleToggle(titles) {
    this.activeTitles = titles;
  }

  ngxWizardFunction(path: string) {
    if (path.indexOf("forms/ngx") !== -1)
      this.router.navigate(["forms/ngx/wizard"], { skipLocationChange: false });
  }

}
