import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalConfig, NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'app/shared/configs/app-config';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})

export class ReportsComponent implements OnInit {
  loadingIndicator :boolean = true;

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

  SearchFrm = new FormGroup ({
    dStart: new FormControl(''),
    dStop: new FormControl('')
  });

  UsCode :string;       UsFName :string;
  UsPosCode :string;    SelectYear: string;
  SelectMonth: string;  SelectRepType: string;
  SearchDate :NgbDateStruct;  UserTimeline: string;
  UserFullNameTimeline: string;  DateTimeline: string;

  ListMonth = [];       ListYear = [];
  DbDeptINV = [];       RepTypeA = [];
  RepTypeB = [];        RepTypeC = [];
  RepTypeD = [];        RepTypeE = [];
  DbEmp = [];           DbListDaily = [];
  DbListActionManActn = []; DbDownTime = [];
  DbRiskByType = [];    DbRiskBySource = [];
  DbRiskByYear = [];    DBRiskByOptionType = [];
  DbListActionSLA = [];

  RepPage = 1;
  RowPerPage = 10;
  NotiPages = 1;
  SumFTE = 0;

  ngOnInit(){
    const ToDay = new Date();
    this.SearchDate = this.calendar.getToday();
    this.ListYear = this.appConfig.YearList;
    this.ListMonth = this.appConfig.MonthList;
    this.SelectYear  = "" + ToDay.getFullYear();
    this.SelectMonth = this.appConfig.padLeft((ToDay.getMonth()+1),2,"0");
    this.UsCode = localStorage.getItem( 'LgUserCode' );
    this.UsFName = localStorage.getItem( 'LgUsrFullName' );
    this.UsPosCode = localStorage.getItem( 'LgUsrPosCode' );
    if(this.UsCode==null||this.UsCode==""){
      this.SelectRepType = "A";
    }else{
      this.SelectRepType = "A";
    }
    this.GetReport();
  }

  GetSearchDefault(){
    const date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth();
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
    console.log( this.SearchFrm );
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
    console.log( this.SelectRepType );
    // console.log( this.SelectYear, this.SelectMonth );
    if(this.SelectRepType=="A"){
      this.http.get(
        this.appConfig.urlApi +
        "Report_P4P.php" +
        "?yy=" + this.SelectYear +
        "&mm=" + this.SelectMonth
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
        "Report_plopblem.php" +
        "?yy=" + this.SelectYear
      ).subscribe(
        (data:any)=>{
          this.RepTypeB = data;
          // console.log( this.RepTypeB );
        }
      )
    }else
    if(this.SelectRepType=="C"){
      this.http.get(
        this.appConfig.urlApi +
        "Report_TimeCheck.php" +
        "?yy=" + this.SelectYear +
        "&mm=" + this.SelectMonth
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
        "Report_SLA.php" +
        "?yy=" + this.SelectYear+
        "&mm=" + this.SelectMonth
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
        "Report_FTE.php" +
        "?yy=" + this.SelectYear
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
        "getEmproyee.php" +
        "?yy=" + this.SelectYear
      ).subscribe(
        (data:any)=>{
          this.DbEmp = data;
          var cRow = this.DbEmp.length;
          if(cRow>0){
            this.GetDailyByDate(
              this.DbEmp[0].UsInternet,
              this.DbEmp[0].UsName
            );
          }
          // console.log( this.RepTypeE );
        }
      )
    }else
    if(this.SelectRepType=="G"){
      this.http.get(
        this.appConfig.urlApi +
        "report_downtime.php" +
        "?yy=" + this.SelectYear
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
        "report_riskbyyear.php" +
        "?yy=" + this.SelectYear +
        "&mm=" + this.SelectMonth
      ).subscribe(
        async ( data:any)=>{
          this.DbRiskByYear = data;
          // console.log( this.DbRiskByYear );
          await this.ReportRiskByType(this.SelectYear);
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
        console.log( this.DbRiskByType );
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
        console.log( this.DbRiskBySource );
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

}
