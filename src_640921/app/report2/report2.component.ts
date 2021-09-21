import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalConfig, NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'app/shared/configs/app-config';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import * as moment from 'moment';
import { ChartType, ChartOptions } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';

@Component({
  selector: 'app-report2',
  templateUrl: './report2.component.html',
  styleUrls: ['./report2.component.scss']
})

export class Report2Component implements OnInit {
  loadingIndicator :boolean = true;
  public pieChartOptions: ChartOptions = { responsive: true, };
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartLabels: Label[] = [];
  public pieChartRep: Label[] = ['งานตามตำแหน่ง (Activitie)', 'งานแก้ปัญหา (Incedent)', 'งานพัฒนา (Develop)', 'งานอื่นๆ (Other)'];
  public pieChartData: SingleDataSet = [];
  public pieChartDataAllDept: SingleDataSet = [];
  public pieChartDataProgramer: SingleDataSet = [];
  public pieChartDataTechnincal: SingleDataSet = [];
  public pieChartDataPublicHealth: SingleDataSet = [];
  public pieChartLabelsTop5Dept: Label[] = [];
  public pieChartRepTop5Dept: (string | number)[] = [];
  public pieChartLabelsRepByPlopb: Label[] = [];
  public pieChartRepByPlopb: (string | number)[] = [];

  constructor(
    private http :HttpClient,
    private appConfig :AppConfig,
    private modalService :NgbModal,
    config :NgbModalConfig,
    private calendar: NgbCalendar,
    // monkeyPatchChartJsTooltip();
    // monkeyPatchChartJsLegend();
  ){
    config.backdrop = 'static';
    config.keyboard = false;
    setTimeout( () => { this.loadingIndicator = false; }, 1500 );
  }

  ServInfo = {
    ActDName: '-', ActGrpName: '', ActHName: '', SevAccDates: '',
    SevAccResult: '', SevAccUser: '', SevCode: '', SevOnMyWay: '',
    SevProductCode: '-', SevReqCallBack: '', SevReqDept: '',
    SevReqDeptName: '', SevReqGrpCode: '', SevReqListCode: '',
    SevReqListSubCode: '', SevReqMend: '', SevReqProblem: '',
    SevReqProblemPoint: '', SevReqUser: '', SevTimeAtDept: '',
    SevTimeDoFinish: '', SevTimeReqTel: '', SevTimeTotal: '',
    SevTotalCase: '', SevTimeSdWork:'', SevType: '', SevUserMend: '',
    SevUserNotify: '', TimeInsure: '', TimeInsureUnit: '',
    TimeP4P: '', TimeP4PUnit: '', UserMendName: '',
    UserNotifyName: '', SevReqDateTime:'', SevHaType:'N',
    SevIsRisk:'N'
  }

  HaItInfo = {
    SumWorkDay: 0,
    SumActeCase: 0, SumActeTime: 0,  SumAllCase: 0,  SumAllTime: 0,
    SumDeveCase: 0, SumDeveTime: 0,  SumIncdCase: 0, SumIncdTime: 0,
    SumOthrCase: 0, SumOthrTime: 0,
    SumAllCaseAvg: 0.0,  SumAllTimeAvg: 0.0,
    SumActeCaseAvg: 0.0, SumActeTimeAvg: 0.0,
    SumIncdCaseAvg: 0.0, SumIncdTimeAvg: 0.0,
    SumDeveCaseAvg: 0.0, SumDeveTimeAvg: 0.0,
    SumOthrCaseAvg: 0.0, SumOthrTimeAvg: 0.0

  }

  ChartProgrammer = { Activitie: 0, Incedent: 0, Develop: 0, Other: 0 }
  ChartTechnincal = { Activitie: 0, Incedent: 0, Develop: 0, Other: 0 }
  ChartPublicHealth = { Activitie: 0, Incedent: 0, Develop: 0, Other: 0 }


  SearchFrm = new FormGroup ({
    dStart: new FormControl(''),
    dStop: new FormControl('')
  });

  UsCode: string;       UsFName :string;
  UsPosCode: string;    SelectYear: string;
  SelectMonth: string;  SelectRepType: string;
  SearchDate: NgbDateStruct;  UserTimeline: string;
  UserFullNameTimeline: string;  DateTimeline: string;
  DateBegin: string;    DateEnd :string;

  ListMonth = [];       ListYear = [];
  DbDeptINV = [];       RepTypeA = [];
  RepTypeB = [];        RepTypeC = [];
  RepTypeD = [];        RepTypeE = [];
  DbEmp = [];           DbListDaily = [];
  DbListActionManActn = []; DbDownTime = [];
  DbRiskByType = [];    DbRiskBySource = [];
  DbRiskByYear = [];    DBRiskByOptionType = [];
  DbListActionSLA = []; DbHAType = [];
  DbDaily = [];         DbRiskByDate = [];
  DbRepPerson = [];     DbActivitie = [];
  DbRepDeptTop5 = [];   DbRepByPlopb = [];
  DbGrpUsrIncedent = [];   DbGrpUsrActivitie = [];

  RepPage = 1;     RepManPage = 1;
  RowPerPage = 10;
  ACTRowPerPage = 50;
  RepManRowPerPage = 10;
  NotiPages = 1;    SumFTE = 0;
  ActivitiePages = 1;

  ngOnInit(){
    this.GetSearchDefault();
    // this.pieChartRep = [ 'งานตามตำแหน่ง (Activitie)', 'งานแก้ปัญหา (Incedent)', 'งานพัฒนา (Develop)', 'งานอื่นๆ (Other)'];
    this.SearchDate = this.calendar.getToday();
    this.ListYear = this.appConfig.YearList;
    this.ListMonth = this.appConfig.MonthList;
    this.UsCode = localStorage.getItem( 'LgUserCode' );
    this.UsFName = localStorage.getItem( 'LgUsrFullName' );
    this.UsPosCode = localStorage.getItem( 'LgUsrPosCode' );
    if(this.UsCode==null||this.UsCode==""){
      this.SelectRepType = "A";
    }else{
      this.SelectRepType = "F";
    }
    this.GetReport();
  }

  GetSearchDefault(){
    const date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth();
    this.SelectYear  = "" + date.getFullYear();
    this.SelectMonth = this.appConfig.padLeft((date.getMonth()+1),2,"0");
    this.SearchFrm.patchValue({
      dStart :{
        date:{
          year: date.getFullYear(),
          month: date.getMonth()+1,
          day: moment(new Date(y, m, 1)).format('D')
      }},
      dStop :{
        date:{
          year: date.getFullYear(),
          month: date.getMonth()+1,
          day: moment(new Date(y, m+1, 0)).format('D')
      }}
    });
    this.ConvDateForm2DateStr();
    // console.log( this.SearchFrm );
  }

  ConvDateForm2DateStr(){
    this.DateBegin = this.SearchFrm.value.dStart.date.year+""+
                     this.appConfig.padLeft(this.SearchFrm.value.dStart.date.month,2,"0")+""+
                     this.appConfig.padLeft(this.SearchFrm.value.dStart.date.day,2,"0") ;
    this.DateEnd   = this.SearchFrm.value.dStop.date.year+""+
                     this.appConfig.padLeft(this.SearchFrm.value.dStop.date.month,2,"0")+""+
                     this.appConfig.padLeft(this.SearchFrm.value.dStop.date.day,2,"0") ;
  }

  GetDeptInv(){
    this.http.get(
      this.appConfig.urlApi +
      "getDeptINV.php"
    ).subscribe(
      (data:any)=>{
        this.DbDeptINV = data;
        //console.log( this.DbDeptINV );
      }
    )
  }

  GetReport(){
    this.ConvDateForm2DateStr();
    // console.log( this.DateBegin, this.DateEnd );
    console.log( this.SelectRepType );
    if(this.SelectRepType=="A"){
      this.http.get(
        this.appConfig.urlApi +
        "Report_P4PNv.php" +
        "?db="+ this.DateBegin +
        "&de="+ this.DateEnd
      ).subscribe(
        (data:any)=>{
          this.RepTypeA = data;
          // console.log( this.RepTypeA );
        }
      )
    }else
    if(this.SelectRepType=="B"){
      this.http.get(
        this.appConfig.urlApi +
        "Report_plopblemNv.php" +
        "?db="+ this.DateBegin +
        "&de="+ this.DateEnd
      ).subscribe(
        async (data:any)=>{
          this.RepTypeB = data;
          await this.ReportServiceByDeptTop5(this.DateBegin, this.DateEnd);
          await this.ReportServiceByPlopb(this.DateBegin, this.DateEnd);
          // console.log( this.RepTypeB );
        }
      )
    }else
    if(this.SelectRepType=="C"){
      this.http.get(
        this.appConfig.urlApi +
        "Report_TimeCheckNv.php" +
        "?db="+ this.DateBegin +
        "&de="+ this.DateEnd
      ).subscribe(
        (data:any)=>{
          this.RepTypeC = data;
          // console.log( this.RepTypeC );
        }
      )
    }else
    if(this.SelectRepType=="D"){
      this.http.get(
        this.appConfig.urlApi +
        "Report_SLANv.php" +
        "?db="+ this.DateBegin +
        "&de="+ this.DateEnd
      ).subscribe(
        (data:any)=>{
          this.RepTypeD = data;
          // console.log( this.RepTypeD );
        }
      )
    }else
    if(this.SelectRepType=="E"){
      this.http.get(
        this.appConfig.urlApi +
        "Report_FTENv.php" +
        "?db="+ this.DateBegin +
        "&de="+ this.DateEnd
      ).subscribe(
        (data:any)=>{
          this.RepTypeE = data;
          var LastRow = this.RepTypeE.length-1;
          this.SumFTE = Number(this.RepTypeE[LastRow].PrmFTE)
                      + Number(this.RepTypeE[LastRow].TchFTE)
                      + Number(this.RepTypeE[LastRow].InfFTE)
                      + Number(this.RepTypeE[LastRow].HlhFTE)
                      + Number(this.RepTypeE[LastRow].AdmFTE);
          // console.log( this.RepTypeE );
        }
      )
    }else
    if(this.SelectRepType=="F"){
      this.http.get(
        this.appConfig.urlApi +
        "getDailyByBetweenDate.php" +
        "?db="+ this.DateBegin +
        "&de="+ this.DateEnd +
        "&st="+ 'S' +
        "&ur=*"
      ).subscribe(
        async (data:any)=>{
          this.DbDaily = data;
          //console.log( this.DbDaily );
          await this.ReportActivitieBetweenDate(this.DateBegin, this.DateEnd);
          await this.GroupIncedentBetweenDate();
          await this.GroupActiviteBetweenDate();
          await this.ReportHAType(this.DateBegin, this.DateEnd);
        }
      )
    }else
    if(this.SelectRepType=="G"){
      this.http.get(
        this.appConfig.urlApi +
        "report_downtimeNv.php" +
        "?db="+ this.DateBegin +
        "&de="+ this.DateEnd
      ).subscribe(
        (data:any)=>{
          this.DbDownTime = data;
          // console.log( this.DbDownTime );
        }
      )
    }else
    if(this.SelectRepType=="H"){
      this.http.get(
        this.appConfig.urlApi +
        "report_riskbyyearNv.php" +
        "?db="+ this.DateBegin +
        "&de="+ this.DateEnd
      ).subscribe(
        async ( data:any)=>{
          this.DbRiskByYear = data;
          // console.log( this.DbRiskByYear );
          await this.ReportRiskFromActivite(this.DateBegin, this.DateEnd);
        }
      )
    }
  }

  ReportTypeA(){
    this.SelectRepType = "A";
    this.GetReport();
  }

  ReportTypeB(){
    this.SelectRepType = "B";
    this.GetReport();
  }

  ReportTypeC(){
    this.SelectRepType = "C";
    this.GetReport();
  }

  ReportTypeD(){
    this.SelectRepType = "D";
    this.GetReport();
  }

  ReportTypeE(){
    this.SelectRepType = "E";
    this.GetReport();
  }

  ReportTypeF(){
    this.SelectRepType = "F";
    this.GetReport();
  }

  ReportTypeG(){
    this.SelectRepType = "G";
    this.GetReport();
  }

  ReportTypeH(){
    this.SelectRepType = "H";
    this.GetReport();
  }

  GetDailyByDate(zUser, zUserFName:string){
    var zYear =""+this.SearchDate.year;
    var zDateShow=""
                 + this.appConfig.padLeft( this.SearchDate.day,2,"0")+'/'
                 + this.appConfig.padLeft( this.SearchDate.month,2,"0")+'/'
                 + zYear;
        zYear = zYear.substr(2, 2);
    var zDate=""+ zYear
                 + this.appConfig.padLeft( this.SearchDate.month,2,"0")
                 + this.appConfig.padLeft( this.SearchDate.day,2,"0");
    if(zUser=="*"){ zUser = this.UserTimeline; }
    if(zUserFName!="*"){ this.UserFullNameTimeline = zUserFName; }
    this.UserTimeline = zUser;
    this.DateTimeline = zDateShow;
    // console.log( zUser, zDateShow );
    this.http.get(
      this.appConfig.urlApi +
      "getDailyByDate.php" +
      "?dt=" + zDate +
      "&us=" + zUser
    ).subscribe(
      (data:Array<any>)=>{
        this.DbListDaily = data;
        // console.log( this.DbListDaily );
      }
    )
  }

  ShowModal( content ) {
    this.modalService.open( content, {size:'lg'} );
  }

  ShowActivitieInfo( content, zUser, zActn:any ){
    var zYM = this.SelectYear + this.SelectMonth
    // console.log( zUser, zActn, zYM );
    this.http.get(
      this.appConfig.urlApi +
      "getUserByDateActn.php" +
      "?usr=" + zUser +
      "&act=" + zActn +
      "&dte=" + zYM
    ).subscribe(
      (data:Array<any>)=>{
        this.DbListActionManActn = data;
        console.log( this.DbListActionManActn );
        this.ShowModal( content );
      }
    )
  }

  ShowActivitieInfoBySLA( content, zRowDb:any ){
    var zYM = this.SelectYear + this.SelectMonth
    var zRowID = zRowDb.SlaID;
    // console.log( zUser, zActn, zYM );
    this.http.get(
      this.appConfig.urlApi +
      "ShowActivitieInfoBySLA.php" +
      "?act=" + zRowID +
      "&dte=" + zYM
    ).subscribe(
      (data:Array<any>)=>{
        this.DbListActionSLA = data;
        // console.log( this.DbListActionSLA );
        this.ShowModal( content );
      }
    )
  }

  ReportRiskByType(xYear){
    this.http.get(
      this.appConfig.urlApi +
      "report_riskbytype.php" +
      "?yy=" + xYear
    ).subscribe(
      async (data:any)=>{
        this.DbRiskByType = data;
        // console.log( this.DbRiskByType );
        await this.ReportRiskBySource(xYear);
      }
    )
  }

  ReportRiskBySource(xYear){
    this.http.get(
      this.appConfig.urlApi +
      "report_RiskBySource.php" +
      "?yy=" + xYear
    ).subscribe(
      async (data:any)=>{
        this.DbRiskBySource = data;
        // console.log( this.DbRiskBySource );
        await this.ReportRiskByOptionType(xYear);
      }
    )
  }

  ReportRiskByOptionType(xYear){
    this.http.get(
      this.appConfig.urlApi +
      "report_RiskByOptionType.php" +
      "?yy=" + xYear
    ).subscribe(
      async (data:any)=>{
        this.DBRiskByOptionType = data;
        // await
        // console.log( this.DBRiskByOptionType );
      }
    )
  }

  ReportHAType(BgDate, EdDate){
    this.http.get(
      this.appConfig.urlApi +
      "getHATypeReport.php" +
      "?db="+ BgDate +
      "&de="+ EdDate
    ).subscribe(
      async (data:any)=>{
        // console.log( data );
        this.DbHAType = data;
        var Usercode = "";

        this.HaItInfo.SumAllCase = 0;    this.HaItInfo.SumAllTime = 0;
        this.HaItInfo.SumActeCase = 0;   this.HaItInfo.SumActeTime = 0;
        this.HaItInfo.SumIncdCase = 0;   this.HaItInfo.SumIncdTime = 0;
        this.HaItInfo.SumDeveCase = 0;   this.HaItInfo.SumDeveTime = 0;
        this.HaItInfo.SumOthrCase = 0;   this.HaItInfo.SumOthrTime = 0;

        this.ChartProgrammer.Activitie = 0;
        this.ChartProgrammer.Incedent = 0;
        this.ChartProgrammer.Develop = 0;
        this.ChartProgrammer.Other = 0;
        this.ChartTechnincal.Activitie = 0;
        this.ChartTechnincal.Incedent = 0;
        this.ChartTechnincal.Develop = 0;
        this.ChartTechnincal.Other = 0;
        this.ChartPublicHealth.Activitie = 0;
        this.ChartPublicHealth.Incedent = 0;
        this.ChartPublicHealth.Develop = 0;
        this.ChartPublicHealth.Other = 0;

        for(let index=0; index < this.DbHAType.length; index++){
          this.HaItInfo.SumActeCase = this.HaItInfo.SumActeCase + this.DbHAType[index].ActivitieCase;
          this.HaItInfo.SumActeTime = this.HaItInfo.SumActeTime + parseInt(this.DbHAType[index].ActivitieTime);
          this.HaItInfo.SumAllCase = this.HaItInfo.SumAllCase + this.DbHAType[index].AllCase;
          this.HaItInfo.SumAllTime = this.HaItInfo.SumAllTime + parseInt(this.DbHAType[index].AllTime);
          this.HaItInfo.SumDeveCase = this.HaItInfo.SumDeveCase + this.DbHAType[index].DevelopCase;
          this.HaItInfo.SumDeveTime = this.HaItInfo.SumDeveTime + parseInt(this.DbHAType[index].DevelopTime);
          this.HaItInfo.SumIncdCase = this.HaItInfo.SumIncdCase + this.DbHAType[index].IncedentCase;
          this.HaItInfo.SumIncdTime = this.HaItInfo.SumIncdTime + parseInt(this.DbHAType[index].IncedentTime);
          this.HaItInfo.SumOthrCase = this.HaItInfo.SumOthrCase + this.DbHAType[index].OthterCase;
          this.HaItInfo.SumOthrTime = this.HaItInfo.SumOthrTime + parseInt(this.DbHAType[index].OthterTime);
          Usercode = this.DbHAType[index].UsInternet;
          Usercode = Usercode.toLocaleLowerCase();

          if(this.DbHAType[index].AllTime!="0"){
            var SumAllTime :number = parseInt(this.DbHAType[index].AllTime);
            this.DbHAType[index].ActivitieAvg = (100/SumAllTime)*parseInt(this.DbHAType[index].ActivitieTime);
            this.DbHAType[index].IncedentAvg = (100/SumAllTime)*parseInt(this.DbHAType[index].IncedentTime);
            this.DbHAType[index].DevelopAvg = (100/SumAllTime)*parseInt(this.DbHAType[index].DevelopTime);
            this.DbHAType[index].OthterAvg = (100/SumAllTime)*parseInt(this.DbHAType[index].OthterTime);
          }else{
            this.DbHAType[index].ActivitieAvg = 0;
            this.DbHAType[index].IncedentAvg = 0;
            this.DbHAType[index].DevelopAvg = 0;
            this.DbHAType[index].OthterAvg = 0;
          }

          if(this.DbHAType[index].UsType=="PM"){
            // ข้อมูลสถิติสำหรับ-โปรแกรมเมอร์
            this.ChartProgrammer.Activitie = this.ChartProgrammer.Activitie + parseInt(this.DbHAType[index].ActivitieTime);
            this.ChartProgrammer.Incedent = this.ChartProgrammer.Incedent + parseInt(this.DbHAType[index].IncedentTime);
            this.ChartProgrammer.Develop = this.ChartProgrammer.Develop + parseInt(this.DbHAType[index].DevelopTime);
            this.ChartProgrammer.Other = this.ChartProgrammer.Other + parseInt(this.DbHAType[index].OthterTime);
          }else
          if(this.DbHAType[index].UsType=="TN"){
            // ข้อมูลสถิติสำหรับ-ช่าง
            this.ChartTechnincal.Activitie = this.ChartTechnincal.Activitie + parseInt(this.DbHAType[index].ActivitieTime);
            this.ChartTechnincal.Incedent = this.ChartTechnincal.Incedent + parseInt(this.DbHAType[index].IncedentTime);
            this.ChartTechnincal.Develop = this.ChartTechnincal.Develop + parseInt(this.DbHAType[index].DevelopTime);
            this.ChartTechnincal.Other = this.ChartTechnincal.Other + parseInt(this.DbHAType[index].OthterTime);
          }else
          //if(this.DbHAType[index].UsType=="HA"||this.DbHAType[index].UsType=="IF"){
          if( Usercode == "namphueng" || Usercode == "kanya" ||
              Usercode == "a_aec" || Usercode == "slybabymeaw" ){
             // ข้อมูลสถิติสำหรับ-ข้อมูล,วิชาการ
            this.ChartPublicHealth.Activitie = this.ChartPublicHealth.Activitie + parseInt(this.DbHAType[index].ActivitieTime);
            this.ChartPublicHealth.Incedent = this.ChartPublicHealth.Incedent + parseInt(this.DbHAType[index].IncedentTime);
            this.ChartPublicHealth.Develop = this.ChartPublicHealth.Develop + parseInt(this.DbHAType[index].DevelopTime);
            this.ChartPublicHealth.Other = this.ChartPublicHealth.Other + parseInt(this.DbHAType[index].OthterTime);
          }
        }

        // console.log( this.ChartProgrammer );
        // console.log( this.ChartTechnincal );
        // console.log( this.ChartPublicHealth );

        this.pieChartDataAllDept = [
          this.HaItInfo.SumActeTime,
          this.HaItInfo.SumIncdTime,
          this.HaItInfo.SumDeveTime,
          this.HaItInfo.SumOthrTime
        ];

        this.pieChartDataProgramer = [
          this.ChartProgrammer.Activitie,
          this.ChartProgrammer.Incedent,
          this.ChartProgrammer.Develop,
          this.ChartProgrammer.Other
        ];

        this.pieChartDataTechnincal = [
          this.ChartTechnincal.Activitie,
          this.ChartTechnincal.Incedent,
          this.ChartTechnincal.Develop,
          this.ChartTechnincal.Other
        ];

        this.pieChartDataPublicHealth = [
          this.ChartPublicHealth.Activitie,
          this.ChartPublicHealth.Incedent,
          this.ChartPublicHealth.Develop,
          this.ChartPublicHealth.Other
        ];

        await this.ReportWorkDay(BgDate, EdDate);
      }
    )
  }

  GroupIncedentBetweenDate(){
    this.DbGrpUsrIncedent = [];
    this.http.get(
      this.appConfig.urlApi +
        "getGroupIncedentBetweenDate.php" +
        "?db="+ this.DateBegin +
        "&de="+ this.DateEnd +
        "&st=S"
    ).subscribe(
      (data:any)=>{
        this.DbGrpUsrIncedent = data;
        // console.log(this.DbGrpUsrIncedent);
      }
    )
  }

  GroupActiviteBetweenDate(){
    this.DbGrpUsrActivitie = [];
    this.http.get(
      this.appConfig.urlApi +
        "getGroupIncedentBetweenDate.php" +
        "?db="+ this.DateBegin +
        "&de="+ this.DateEnd +
        "&st=A"
    ).subscribe(
      (data:any)=>{
        this.DbGrpUsrActivitie = data;
        // console.log(this.DbGrpUsrActivitie);
      }
    )
  }

  ReportIncedentByUserBetweenDate(zUser){
    // console.log(zUser);
    this.http.get(
      this.appConfig.urlApi +
        "getDailyByBetweenDate.php" +
        "?db="+ this.DateBegin +
        "&de="+ this.DateEnd +
        "&st="+ 'S' +
        "&ur=" + zUser
    ).subscribe(
      (data:any)=>{
        this.DbDaily = data;
        // console.log(this.DbDaily);
      }
    )
  }

  ReportActivitieBetweenDate(BgDate, EdDate){
    this.http.get(
      this.appConfig.urlApi +
        "getDailyByBetweenDate.php" +
        "?db="+ this.DateBegin +
        "&de="+ this.DateEnd +
        "&st="+ 'A' + "&ur=*"
    ).subscribe(
      (data:any)=>{
        this.DbActivitie = data;
      }
    )
  }

  ReportActivitieByUserBetweenDate(zUser){
    // console.log(zUser);
    this.http.get(
      this.appConfig.urlApi +
        "getDailyByBetweenDate.php" +
        "?db="+ this.DateBegin +
        "&de="+ this.DateEnd +
        "&st="+ 'A' +
        "&ur=" + zUser
    ).subscribe(
      (data:any)=>{
        this.DbActivitie = data;
        // console.log(this.DbActivitie);
      }
    )
  }

  ReportWorkDay(BgDate, EdDate){
    this.http.get(
      this.appConfig.urlApi +
      "getReportWorkDay.php" +
      "?db="+ BgDate +
      "&de="+ EdDate
    ).subscribe(
      (data:any)=>{
        var xWork = data;
        this.HaItInfo.SumAllCaseAvg = 0.0;    this.HaItInfo.SumAllTimeAvg = 0.0;
        this.HaItInfo.SumActeCaseAvg = 0.0;   this.HaItInfo.SumActeTimeAvg = 0.0;
        this.HaItInfo.SumIncdCaseAvg = 0.0;   this.HaItInfo.SumIncdTimeAvg = 0.0;
        this.HaItInfo.SumDeveCaseAvg = 0.0;   this.HaItInfo.SumDeveTimeAvg = 0.0;
        this.HaItInfo.SumOthrCaseAvg = 0.0;   this.HaItInfo.SumOthrTimeAvg = 0.0;
        this.HaItInfo.SumWorkDay = parseInt( xWork[0].WorkDay );
        var WorkDay:number = this.HaItInfo.SumWorkDay;
        // console.log( this.HaItInfo );
        // console.log( WorkDay );
        if( this.HaItInfo.SumAllCase==0 ){ this.HaItInfo.SumAllCaseAvg = 0; }
        else{ this.HaItInfo.SumAllCaseAvg = this.HaItInfo.SumAllCase/WorkDay; }

        if( this.HaItInfo.SumAllTime==0 ){ this.HaItInfo.SumAllTimeAvg = 0; }
        else{ this.HaItInfo.SumAllTimeAvg = this.HaItInfo.SumAllTime/WorkDay; }

        if( this.HaItInfo.SumActeCase==0 ){ this.HaItInfo.SumActeCaseAvg = 0; }
        else{ this.HaItInfo.SumActeCaseAvg = this.HaItInfo.SumActeCase/WorkDay; }

        if( this.HaItInfo.SumActeTime==0 ){ this.HaItInfo.SumActeTimeAvg = 0; }
        else{ this.HaItInfo.SumActeTimeAvg = this.HaItInfo.SumActeTime/WorkDay; }

        if( this.HaItInfo.SumIncdCase==0 ){ this.HaItInfo.SumIncdCaseAvg = 0; }
        else{ this.HaItInfo.SumIncdCaseAvg = this.HaItInfo.SumIncdCase/WorkDay; }

        if( this.HaItInfo.SumIncdTime==0 ){ this.HaItInfo.SumIncdTimeAvg = 0; }
        else{ this.HaItInfo.SumIncdTimeAvg = this.HaItInfo.SumIncdTime/WorkDay; }

        if( this.HaItInfo.SumDeveCase==0 ){ this.HaItInfo.SumDeveCaseAvg = 0; }
        else{ this.HaItInfo.SumDeveCaseAvg = this.HaItInfo.SumDeveCase/WorkDay; }

        if( this.HaItInfo.SumDeveTime==0 ){ this.HaItInfo.SumDeveTimeAvg = 0; }
        else{ this.HaItInfo.SumDeveTimeAvg = this.HaItInfo.SumDeveTime/WorkDay; }

        if( this.HaItInfo.SumOthrCase==0 ){ this.HaItInfo.SumOthrCaseAvg = 0; }
        else{ this.HaItInfo.SumOthrCaseAvg = this.HaItInfo.SumOthrCase/WorkDay; }

        if( this.HaItInfo.SumOthrTime==0 ){ this.HaItInfo.SumOthrTimeAvg = 0; }
        else{ this.HaItInfo.SumOthrTimeAvg = this.HaItInfo.SumOthrTime/WorkDay; }
        // console.log( this.HaItInfo );
      }
    )
  }

  ShowActivitieInfo2( content, item:any ){
    // console.log( this.DbListActivitie[zindox] );
    this.ServInfo.SevCode = item.SevCode;
    this.ServInfo.SevType = item.SevType;
    this.ServInfo.SevUserMend = item.SevUserMend;
    this.ServInfo.UserMendName = item.UserMendName;
    this.ServInfo.SevUserNotify = item.SevUserNotify;
    this.ServInfo.UserNotifyName = item.UserNotifyName;
    this.ServInfo.SevReqDateTime = this.appConfig.ConvDb2Date( item.SevDateSave );
    this.ServInfo.SevReqDept = item.SevReqDept;
    this.ServInfo.SevReqDeptName = item.SevReqDeptName;
    this.ServInfo.SevReqCallBack = item.SevReqCallBack;
    this.ServInfo.SevReqUser = item.SevReqUser;
    this.ServInfo.SevReqGrpCode = item.SevReqGrpCode;
    this.ServInfo.ActGrpName = item.ActGrpName;
    this.ServInfo.SevReqListCode = item.SevReqListCode;
    this.ServInfo.ActHName = item.ActHName;
    this.ServInfo.SevReqListSubCode = item.SevReqListSubCode;
    this.ServInfo.ActDName = item.ActDName;
    this.ServInfo.SevReqProblem = item.SevReqProblem;
    this.ServInfo.SevReqProblemPoint = item.SevReqProblemPoint;
    this.ServInfo.SevProductCode = item.SevProductCode;
    this.ServInfo.SevReqMend = item.SevReqMend;
    this.ServInfo.SevTimeReqTel = item.SevTimeReqTel;
    this.ServInfo.SevTimeAtDept = item.SevTimeAtDept;
    this.ServInfo.SevTimeDoFinish = item.SevTimeDoFinish;
    this.ServInfo.SevTimeTotal = item.SevTimeTotal;
    this.ServInfo.SevTotalCase = item.SevTotalCase;
    this.ServInfo.SevAccDates = item.SevAccDates;
    this.ServInfo.SevAccResult = item.SevAccResult;
    this.ServInfo.SevAccUser = item.SevAccUser;
    this.ServInfo.TimeInsure = item.TimeInsure;
    this.ServInfo.TimeInsureUnit = item.TimeInsureUnit;
    this.ServInfo.TimeP4P = item.TimeP4P;
    this.ServInfo.TimeP4PUnit = item.TimeP4PUnit;
    // console.log( this.ServInfo );
    this.ShowModal( content );
  }

  ShowChartService( content, item:any ){
    // console.log( this.HaItInfo );
    // console.log( item );
    var EdUser = item.UsInternet;
    this.ReportDailyByUserBetweenDate(this.DateBegin, this.DateEnd, EdUser);
    this.pieChartLabels = [ 'งานตามตำแหน่ง (Activitie)'
                          , 'งานแก้ปัญหา (Incedent)'
                          , 'งานพัฒนา (Develop)'
                          , 'งานอื่นๆ (Other)'];
    this.pieChartData = [item.ActivitieAvg, item.IncedentAvg, item.DevelopAvg, item.OthterAvg ];
    this.ShowModal( content );
  }

  ShowChartDeptService( content ){
    // console.log( this.HaItInfo );
    this.ReportDailyByUserBetweenDate(this.DateBegin, this.DateEnd, "*");
    this.pieChartLabels = [ 'งานตามตำแหน่ง (Activitie)'
                          , 'งานบริการ (Incedent)'
                          , 'งานพัฒนา (Develop)'
                          , 'งานอื่นๆ (Other)'];
    this.pieChartData = [ ((100/this.HaItInfo.SumAllTime)*this.HaItInfo.SumActeTime)
                        , ((100/this.HaItInfo.SumAllTime)*this.HaItInfo.SumIncdTime)
                        , ((100/this.HaItInfo.SumAllTime)*this.HaItInfo.SumDeveTime)
                        , ((100/this.HaItInfo.SumAllTime)*this.HaItInfo.SumOthrTime) ];
    this.ShowModal( content );
  }

  ReportRiskFromActivite(BgDate, EdDate){
    this.http.get(
      this.appConfig.urlApi +
      "ReportRiskFromActivite.php" +
      "?db="+ BgDate +
      "&de="+ EdDate
    ).subscribe(
      async (data:any)=>{
        this.DbRiskByDate = data;
        console.log( this.DbRiskByDate );
        await this.ReportRiskByType( this.SelectYear );
      }
    )
  }

  ReportDailyByUserBetweenDate(BgDate, EdDate, EdUser){
    this.http.get(
      this.appConfig.urlApi +
      "getDailyByUserBetweenDate.php" +
      "?db="+ BgDate +
      "&de="+ EdDate +
      "&ur="+ EdUser
    ).subscribe(
      async (data:any)=>{
        this.DbRepPerson = data;
        console.log( this.DbRepPerson );
      }
    )
  }

  ReportServiceByDeptTop5(BgDate, EdDate){
    this.http.get(
      this.appConfig.urlApi +
      "Report_PlopSrvByDept.php" +
      "?db="+ BgDate +
      "&de="+ EdDate
    ).subscribe(
      (data:any)=>{
        this.DbRepDeptTop5 = data;
        this.pieChartRepTop5Dept = [];
        this.pieChartLabelsTop5Dept = [];
        // console.log( this.DbRepDeptTop5 );
        for(let index = 0; index < this.DbRepDeptTop5.length; index++){
          this.pieChartLabelsTop5Dept.push(this.DbRepDeptTop5[index].ORG_DESC);
          this.pieChartRepTop5Dept.push( parseFloat(this.DbRepDeptTop5[index].TotalCall) );
        }
        // console.log( this.pieChartLabelsTop5Dept );
        // console.log( this.pieChartRepTop5Dept );
      }
    )
  }

  ReportServiceByPlopb(BgDate, EdDate){
    this.http.get(
      this.appConfig.urlApi +
      "Report_PlopSrvByPlopb.php" +
      "?db="+ BgDate +
      "&de="+ EdDate
    ).subscribe(
      (data:any)=>{
        this.DbRepByPlopb = data;
        this.pieChartRepByPlopb = [];
        this.pieChartLabelsRepByPlopb = [];
        // console.log( this.DbRepByPlopb );
        for (let index = 0; index < this.DbRepByPlopb.length; index++) {
          this.pieChartLabelsRepByPlopb.push(this.DbRepByPlopb[index].SevProblemGroup);
          this.pieChartRepByPlopb.push( parseFloat(this.DbRepByPlopb[index].Total));
        }
        // console.log( this.pieChartLabelsRepByPlopb );
        // console.log( this.pieChartRepByPlopb );
      }
    )
  }

}
