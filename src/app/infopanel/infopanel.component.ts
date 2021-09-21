import { AppConfig } from 'app/shared/configs/app-config';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NgbModal, NgbModalConfig, NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ChartType, ChartEvent } from "ng-chartist";
import * as Chartist from 'chartist';

@Component({
  selector: 'app-infopanel',
  templateUrl: './infopanel.component.html',
  styleUrls: ['./infopanel.component.scss']
})

export class InfopanelComponent implements OnInit, AfterViewInit {
  loadingIndicator :boolean = true;
  type: ChartType;
  data: Chartist.IChartistData;
  options?: any;
  responsiveOptions?: any;
  events?: ChartEvent;
  YearSelect: string;

  ServInfo = {
    ActDName: '-', ActGrpName: '', ActHName: '', SevAccDates: '',
    SevAccResult: '', SevAccUser: '', SevCode: '', SevOnMyWay: '',
    SevProductCode: '-', SevReqCallBack: '', SevReqDept: '',
    SevReqDeptName: '', SevReqGrpCode: '', SevReqListCode: '',
    SevReqListSubCode: '', SevReqMend: '', SevReqProblem: '',
    SevReqProblemPoint: '', SevReqUser: '', SevTimeAtDept: '',
    SevTimeDoFinish: '', SevTimeReqTel: '', SevTimeTotal: '',
    SevTotalCase: '', SevType: '', SevUserMend: '', SevUserNotify: '',
    TimeInsure: '', TimeInsureUnit: '', TimeP4P: '', TimeP4PUnit: '',
    UserMendName: '', UserNotifyName: '', SevReqDateTime:''
  }

  // xData: any;
  view: any[] = [400, 250];
  legend: boolean = false;
  legendPosition: string = 'below';

  RowPerPage = 10;
  Pages = 1;
  SearchDate :NgbDateStruct;

  DbListNotified = [];
  DbListService = [];
  DbRepChart1 = [];
  DbRepChart2 = [];
  DbRepChart3 = [];

  ColorScheme ={domain:['#5AA454','#E44D25','#CFC0BB','#7aa3e5','#a8385d','#aae3f5']};
  ColorScheme2 ={domain:['#ff4444','#CC0000','#ffbb33','#FF8800','#00C851','#007E33','#33b5e5','#0099CC']};

  @ViewChild('Chart') Chart: ElementRef;

  constructor(
    private http :HttpClient,
    private appConfig :AppConfig,
    private modalService :NgbModal,
    config :NgbModalConfig,
    private calendar: NgbCalendar
  ){
    config.backdrop = 'static';
    config.keyboard = false;
    setTimeout( () => { this.loadingIndicator = false; }, 1500 );
  }

  ngOnInit() {
    this.SearchDate = this.calendar.getToday();
    this.YearSelect = "" + (this.SearchDate.year + 543);
    this.GetInfoChart_Plobleam();
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.onResize();
    })
  }

  onResize(){
    this.view = [ this.Chart.nativeElement.offsetWidth,
                  this.Chart.nativeElement.offsetHeight ];
  }

  onSelect( event ) {
    // console.log(event);
    console.log('Item clicked', JSON.parse(JSON.stringify(event)));
  }

  ShowModal( content ) {
    this.modalService.open( content, {size:'lg'} );
  }

  GetDbNotifiedByDate(){
    var zYear =""+this.SearchDate.year;
        zYear = zYear.substr(2, 2);
    var DateDb=""+ zYear
                 + this.appConfig.padLeft( this.SearchDate.month, 2, "0")
                 + this.appConfig.padLeft( this.SearchDate.day, 2, "0");
    // console.log( DateDb );
    this.http.get(
      this.appConfig.urlApi +
      "getDbNotifiedByDate.php" +
      "?dt=" + DateDb
    ).subscribe(
      async (data:any)=>{
        this.DbListNotified = data;
        await this.GetServiceByDate();
        // console.log( this.DbListNotified );
      }
    )
  }

  GetServiceByDate(){
    var zYear =""+this.SearchDate.year;
        zYear = zYear.substr(2, 2);
    var DateDb=""+ zYear
                 + this.appConfig.padLeft( this.SearchDate.month, 2, "0")
                 + this.appConfig.padLeft( this.SearchDate.day, 2, "0");
    // console.log( DateDb );
    this.http.get(
      this.appConfig.urlApi +
      "getServiceByDate.php" +
      "?dt=" + DateDb + "&us=-"
    ).subscribe(
      (data:any)=>{
        this.DbListService = data;
        // console.log( this.DbListService );
      }
    )
  }

  ShowServiceInfo( content, zindox:number ){
    // console.log( this.DbListService[zindox] );
    this.ServInfo.SevCode = this.DbListService[zindox].SevCode;
    this.ServInfo.SevType = this.DbListService[zindox].SevType;
    this.ServInfo.SevUserMend = this.DbListService[zindox].SevUserMend;
    this.ServInfo.UserMendName = this.DbListService[zindox].SevUserMend;
    this.ServInfo.SevUserNotify = this.DbListService[zindox].SevUserNotify;
    this.ServInfo.UserNotifyName = this.DbListService[zindox].UserNotifyName;
    this.ServInfo.SevReqDateTime = this.appConfig.ConvDb2Date( this.DbListService[zindox].SevDateSave );
    this.ServInfo.SevReqDept = this.DbListService[zindox].SevReqDept;
    this.ServInfo.SevReqDeptName = this.DbListService[zindox].SevReqDeptName;
    this.ServInfo.SevReqCallBack = this.DbListService[zindox].SevReqCallBack;
    this.ServInfo.SevReqUser = this.DbListService[zindox].SevReqUser;
    this.ServInfo.SevReqGrpCode = this.DbListService[zindox].SevReqGrpCode;
    this.ServInfo.ActGrpName = this.DbListService[zindox].ActGrpName;
    this.ServInfo.SevReqListCode = this.DbListService[zindox].SevReqListCode;
    this.ServInfo.ActHName = this.DbListService[zindox].ActHName;
    this.ServInfo.SevReqListSubCode = this.DbListService[zindox].SevReqListSubCode;
    this.ServInfo.ActDName = this.DbListService[zindox].ActDName;
    this.ServInfo.SevReqProblem = this.DbListService[zindox].SevReqProblem;
    this.ServInfo.SevReqProblemPoint = this.DbListService[zindox].SevReqProblemPoint;
    this.ServInfo.SevProductCode = this.DbListService[zindox].SevProductCode;
    this.ServInfo.SevReqMend = this.DbListService[zindox].SevReqMend;
    this.ServInfo.SevTimeReqTel = this.DbListService[zindox].SevTimeReqTel;
    this.ServInfo.SevTimeAtDept = this.DbListService[zindox].SevTimeAtDept;
    this.ServInfo.SevTimeDoFinish = this.DbListService[zindox].SevTimeDoFinish;
    this.ServInfo.SevTimeTotal = this.DbListService[zindox].SevTimeTotal;
    this.ServInfo.SevTotalCase = this.DbListService[zindox].SevTotalCase;
    this.ServInfo.SevAccDates = this.DbListService[zindox].SevAccDates;
    this.ServInfo.SevAccResult = this.DbListService[zindox].SevAccResult;
    this.ServInfo.SevAccUser = this.DbListService[zindox].SevAccUser;
    this.ServInfo.TimeInsure = this.DbListService[zindox].TimeInsure;
    this.ServInfo.TimeInsureUnit = this.DbListService[zindox].TimeInsureUnit;
    this.ServInfo.TimeP4P = this.DbListService[zindox].TimeP4P;
    this.ServInfo.TimeP4PUnit = this.DbListService[zindox].TimeP4PUnit;
    // console.log( this.ServInfo );
    this.ShowModal( content );
  }

  GetInfoChart_Plobleam(){
    var zYear =""+this.SearchDate.year;
    this.http.get(
      this.appConfig.urlApi +
      "infoChart_YearProblem.php?yy=" + zYear
    ).subscribe(
      async (data:any)=>{
        this.DbRepChart1 = data;
        // console.log( this.DbRepChart1 );
        await this.GetInfoChart_SLA();
      }
    )
  }

  GetInfoChart_SLA(){
    var zYear =""+this.SearchDate.year;
    this.http.get(
      this.appConfig.urlApi +
      "InfoChart_YearSLA.php?yy=" + zYear
    ).subscribe(
      async (data:any)=>{
        this.DbRepChart2 = data;
        // console.log( this.DbRepChart2 );
        await this.GetInfoChart_Dept();
      }
    )
  }

  GetInfoChart_Dept(){
    var zYear =""+this.SearchDate.year;
    this.http.get(
      this.appConfig.urlApi +
      "InfoChart_YearDept.php?yy=" + zYear
    ).subscribe(
      async (data:any)=>{
        this.DbRepChart3 = data;
        // console.log( this.DbRepChart3 );
        await this.GetDbNotifiedByDate();
      }
    )
  }

}
