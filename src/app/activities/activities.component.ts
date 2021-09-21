import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalConfig, NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'app/shared/configs/app-config';
import swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})

export class ActivitiesComponent implements OnInit {
  loadingIndicator :boolean = true;  reorderable :boolean = true;
  UsCode :string; UsFName :string;  UsPosCode :string; ActionHUser :string;
  SearchDate :NgbDateStruct;
  CheckIsHoliday: boolean = false;
  CheckIsHolidayOnForm: boolean = false;

  SevModel = {
    SevCode:null, SevReqDept:null, SevReqCallBack:'-', SevReqUser:'-',
    SevReqGrpCode:null, SevReqListCode:null,  SevReqListSubCode:null,
    SevReqProblem:'-', SevReqProblemPoint:'-', SevReqMend:'-',
    SevTimeReqTel:null, SevTimeAtDept:null,  SevTimeDoFinish:null,
    SevTimeSdWork:null, SevTimeTotal:'0', SevTotalCase:'1',
    SevUserMend:null, SevUserName:'-', SevReqDateTime:null,
    SevProductCode:'-', SevType:'S', SevValidation:'-',
    SevProblemGroup:'-', SevAction:'N', SevHaType:'-',
    SevIsRisk:'N'
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

  NotifModel = {
    NofCode:null, NofReqDept:null, NofReqCallBack:'-', NofReqUser:'-',
    NofReqProblem:'-', NofReqProblemPoint:'-', NofReqDateTime:'-',
    NofUserMend:'-', NofUserName:'-', NofValidation:'-'
  }

  TimeSumry = {
    TimeSum: 0, TimeActn: 0, TimeIncd: 0, TimeDelp: 0, Timeothr: 0
  }

  SearchFrm = new FormGroup ({
    dStart: new FormControl(''),
    dStop: new FormControl('')
  });

  RowPerPage = 7;       ServPages = 1;
  ActvPages = 1;        NotiPages = 1;

  DbDeptINV = [];       DbActivitie = [];
  DbComEmp = [];        DbActionH = [];
  DbActionD = [];       DbService = [];
  DbListNotified = [];  DbListService = [];
  DbListActivitie = []; DbListDaily = [];
  DbListDaily2 = [];

  constructor(
    private http :HttpClient,
    private config :NgbModalConfig,
    private calendar: NgbCalendar,
    private appConfig :AppConfig,
    private modalService :NgbModal
  ){
    config.backdrop = 'static';
    config.keyboard = false;
    setTimeout( () => { this.loadingIndicator = false; }, 1500 );
  }

  ngOnInit(){
    // this.GetSearchDefault();
    this.SearchDate = this.calendar.getToday();
    this.UsCode = localStorage.getItem( 'LgUserCode' );
    this.UsFName = localStorage.getItem( 'LgUsrFullName' );
    this.UsPosCode = localStorage.getItem( 'LgUsrPosCode' );
    if(this.UsPosCode =='PM'){
      this.ActionHUser = this.UsCode;
      this.ActionHUser = 'PM';
    }else{
      this.ActionHUser = "-";
    }
    // console.log( this.UsCode, this.UsFName, this.UsPosCode );
    this.GetDeptInv();
    this.GetDbNotifiedByDate();
    this.GetDailyByDate();
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
    // console.log( this.SearchFrm );
  }

  ClearValueNofModel(){
    this.NotifModel.NofCode = null;
    this.NotifModel.NofReqDept = null;
    this.NotifModel.NofReqCallBack = '-';
    this.NotifModel.NofReqUser = '-';
    this.NotifModel.NofReqProblem = '-';
    this.NotifModel.NofReqProblemPoint = '-';
    this.NotifModel.NofReqDateTime = '-';
    this.NotifModel.NofUserMend = '-';
    this.NotifModel.NofUserName = '-';
    this.NotifModel.NofValidation = '-';
  }

  ClearValueSevModel(){
    this.SevModel.SevCode = null;
    this.SevModel.SevReqDept = null;
    this.SevModel.SevReqCallBack = '-';
    this.SevModel.SevReqUser = '-';
    this.SevModel.SevReqGrpCode = null;
    this.SevModel.SevReqListCode = null;
    this.SevModel.SevReqListSubCode = null;
    this.SevModel.SevReqProblem = '-';
    this.SevModel.SevReqProblemPoint = '-';
    this.SevModel.SevReqMend = '-';
    this.SevModel.SevTimeReqTel = null;
    this.SevModel.SevTimeAtDept = null;
    this.SevModel.SevTimeDoFinish = null;
    this.SevModel.SevTimeSdWork = null;
    this.SevModel.SevTimeTotal = '0';
    this.SevModel.SevTotalCase = '1';
    this.SevModel.SevUserMend = '-';
    this.SevModel.SevUserName = '-';
    this.SevModel.SevReqDateTime = '-';
    this.SevModel.SevProductCode = '-';
    this.SevModel.SevType = 'S';
    this.SevModel.SevHaType = '-';
    this.SevModel.SevAction = 'N';
    this.SevModel.SevIsRisk = 'N';
    this.SevModel.SevValidation = '-';
    this.SevModel.SevProblemGroup = '-';
  }

  ShowModal( content ) {
    this.modalService.open( content, {size:'lg'} );
  }

  ShowServiceInfo( content, zindox:number ){
    // console.log( this.DbListService[zindox] );
    this.ServInfo.SevCode = this.DbListService[zindox].SevCode;
    this.ServInfo.SevType = this.DbListService[zindox].SevType;
    this.ServInfo.SevHaType = this.DbListService[zindox].SevHaType;
    this.ServInfo.SevIsRisk = this.DbListService[zindox].SevIsRisk;
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

  NewService( content ){
    const ServCode = this.appConfig.getCurDateTime2Db();
    //console.log( ServCode );
    var CurUser = new Array();
    CurUser = [this.UsCode];
    this.ClearValueSevModel();
    this.GetServiceByPosType(this.UsPosCode);
    this.SevModel.SevHaType = 'Incedent';
    this.SevModel.SevType = 'S';
    this.SevModel.SevAction = 'N';
    this.SevModel.SevIsRisk = 'N';
    this.SevModel.SevValidation = '-';
    this.SevModel.SevProblemGroup = 'Other';
    this.SevModel.SevCode = ServCode;
    this.SevModel.SevUserMend = CurUser;
    this.SevModel.SevUserName = this.UsFName;
    this.SevModel.SevReqDateTime = this.appConfig.getCurDateNow();
    // console.log( this.SevModel );
    this.ShowModal( content );
  }

  NewActivitie( content ){
    const ServCode = this.appConfig.getCurDateTime2Db();
    //console.log( ServCode );
    var CurUser = new Array();
    CurUser = [this.UsCode];
    this.ClearValueSevModel();
    this.GetActivitieByPosType(this.UsPosCode);
    this.SevModel.SevHaType = 'Activitie';
    this.SevModel.SevType = 'A';
    this.SevModel.SevAction = 'N';
    this.SevModel.SevIsRisk = 'N';
    this.SevModel.SevValidation = '-';
    this.SevModel.SevProblemGroup = 'Other';
    this.SevModel.SevCode = ServCode;
    this.SevModel.SevUserMend = CurUser;
    this.SevModel.SevUserName = this.UsFName;
    this.SevModel.SevReqDateTime = this.appConfig.getCurDateNow();
    // this.SevModel.SevReqDateTime = this.appConfig.ConvDb2DateTime( ServCode );
    this.ShowModal( content );
  }

  NewNotified( content ){
    const ServCode = this.appConfig.getCurDateTime2Db();
    this.NotifModel.NofValidation = '-';
    this.NotifModel.NofCode = ServCode;
    this.NotifModel.NofUserMend = this.UsCode;
    this.NotifModel.NofUserName = this.UsFName;
    this.NotifModel.NofReqDateTime = this.appConfig.ConvDb2DateTime( ServCode );
    this.ShowModal( content );
  }

  GetDeptInv(){
    this.http.get(
      this.appConfig.urlApi +
      "getDeptINV.php"
    ).subscribe(
      (data:any)=>{
        this.DbDeptINV = data;
        //console.log( this.DbDeptINV );
        this.GetActivitieByPosType( this.UsPosCode );
      }
    )
  }

  GetComEmp(){
    this.http.get(
      this.appConfig.urlApi +
      "getComEmp.php"
    ).subscribe(
      (data:any)=>{
        this.DbComEmp = data;
        // console.log( this.DbComEmp );
      }
    )
  }

  GetPhoneByDept( DeptCode :string ){
    // console.log( "DeptCode :"+ DeptCode );
    this.http.get(
      this.appConfig.urlApi +
      "getDeptPhoneByDeptCode.php"+
      "?dc="+ DeptCode
    ).subscribe(
      (data:any)=>{
        // console.log( data );
        var CountRow = data.length;
        if(CountRow >= 1){
          this.SevModel.SevReqCallBack = data[0].Phone;
        }else{
          this.SevModel.SevReqCallBack = "-";
        }
      }
    )
  }

  GetPhoneByDept3( DeptCode :string ){
    // console.log( "DeptCode :"+ DeptCode );
    this.http.get(
      this.appConfig.urlApi +
      "getDeptPhoneByDeptCode.php"+
      "?dc="+ DeptCode
    ).subscribe(
      (data:any)=>{
        // console.log( data );
        var CountRow = data.length;
        if(CountRow >= 1){
          this.NotifModel.NofReqCallBack = data[0].Phone;
        }else{
          this.NotifModel.NofReqCallBack = "-";
        }
      }
    )
  }

  GetActivitieByPosType( PositionCode :string ){
    this.http.get(
      this.appConfig.urlApi +
      "getActivitieByPosiCode.php"+
      "?pc="+ PositionCode
    ).subscribe(
      (data:any)=>{
        this.DbActivitie = data;
        // console.log( this.DbActivitie );
        this.GetServiceByPosType( PositionCode );
      }
    )
  }

  GetServiceByPosType( PositionCode :string ){
    this.http.get(
      this.appConfig.urlApi +
      "getServiceByPosiCode.php"+
      "?pc="+ PositionCode
    ).subscribe(
      (data:any)=>{
        this.DbService = data;
        // console.log( this.DbService );
        this.GetComEmp();
      }
    )
  }

  GetActionHByActCode( ActivitieCode :string ){
    this.http.get(
      this.appConfig.urlApi +
      "getActionHbyActCode.php" +
      "?ac=" + ActivitieCode +
      "&au=" + this.ActionHUser
    ).subscribe(
      (data:any)=>{
        this.DbActionH = data;
        //console.log( this.DbActionH );
        //this.GetActivitieByPosType( this.UsPosCode );
      }
    )
  }

  GetActionDByActHCode( ActHCode :string ){
    this.http.get(
      this.appConfig.urlApi +
      "getActionDbyActHCode.php" +
      "?ac=" + ActHCode
    ).subscribe(
      (data:any)=>{
        this.DbActionD = data;
        // console.log( this.DbActionD );
      }
    )
  }

  SaveNotified(){
    // console.log( this.NotifModel );
    if( this.NotifModel.NofReqDept==null ){
      this.NotifModel.NofValidation = "โปรดเลือกหน่วยงานที่แจ้งปัญหา..!";
    }else if( this.NotifModel.NofReqCallBack=="-" ){
      this.NotifModel.NofValidation = "โปรดระบุเบอร์ติดต่อภายใน..!";
    }else if( this.NotifModel.NofReqUser=="-" ){
      this.NotifModel.NofValidation = "โปรดระบุชื่อผู้แจ้งปัญหา..!";
    }else if( this.NotifModel.NofReqProblem=="-" ){
      this.NotifModel.NofValidation = "โปรดระบุรายละเอียดปัญหาที่รับแจ้ง..!";
    }else{
      setTimeout(()=>{ this.loadingIndicator = true; }, 1000 );
      this.http.post(
        this.appConfig.urlApi +
        "SaveDbNotified.php",
        { prm: this.NotifModel },
        { responseType:"text" }
      ).subscribe(
        async ()=>{
          await this.GetDbNotifiedByDate();
          this.ClearValueNofModel();
          setTimeout(()=>{ this.loadingIndicator = false; }, 1500 );
          this.modalService.dismissAll( 'NotifiedForm' );
        }
      )
    }
  }

  SaveService(){
    // console.log( this.SevModel );
    if( this.SevModel.SevReqDept==null ){
      this.SevModel.SevValidation = "โปรดเลือกหน่วยงานที่แจ้งปัญหา..!";
    }else if( this.SevModel.SevReqCallBack=="-" ){
      this.SevModel.SevValidation = "โปรดระบุเบอร์ติดต่อภายใน..!";
    }else if( this.SevModel.SevReqUser=="-" ){
      this.SevModel.SevValidation = "โปรดระบุชื่อผู้แจ้งปัญหา..!";
    }else if( this.SevModel.SevReqGrpCode==null ){
      this.SevModel.SevValidation = "โปรดเลือกกิจกรรมบริการ..!";
    }else if( this.SevModel.SevReqListCode==null ){
      this.SevModel.SevValidation = "โปรดเลือกกิจกรรมรอง..!";
    }else if( this.SevModel.SevReqListSubCode==null ){
      this.SevModel.SevValidation = "โปรดเลือกกิจกรรมย่อย..!";
    }else if( this.SevModel.SevReqProblem=="-" ){
      this.SevModel.SevValidation = "โปรดระบุปัญหาที่ได้รับแจ้ง..!";
    }else if( this.SevModel.SevTimeAtDept==null ){
      this.SevModel.SevValidation = "โปรดระบุเวลาถึงหน่วยงาน..!";
    }else if( this.SevModel.SevTimeDoFinish==null ){
      this.SevModel.SevValidation = "โปรดระบุเวลาแก้ไขเสร็จ..!";
    }else if( this.SevModel.SevReqMend=="-" ){
      this.SevModel.SevValidation = "โปรดระบุรายละเอียดการแก้ไขปัญหา..!";
    }else if( this.SevModel.SevTotalCase==null ){
      this.SevModel.SevValidation = "โปรดระบุจำนวนปัญหาที่แก้ไข/ครั้ง..!";
    }else if( this.SevModel.SevReqDateTime==null ){
      this.SevModel.SevValidation = "โปรดระบุวันที่บันทึกบริการ..!";
    }else if( this.SevModel.SevProblemGroup=='-'){
      this.SevModel.SevValidation = "โปรดระบุกลุ่มสาเหตุของปัญหา..!";
    }else{
      setTimeout(()=>{ this.loadingIndicator = true; }, 1000 );
      this.http.post(
        this.appConfig.urlApi +
        "SaveDbService.php",
        { prm: this.SevModel },
        { responseType:"text" }
      ).subscribe(
        async ()=>{
          await this.GetDailyByDate();
          this.GetDbNotifiedByDate();
          this.ClearValueSevModel();
          setTimeout(()=>{ this.loadingIndicator = false; }, 1500 );
          this.modalService.dismissAll( 'ServiceForm' );
        }
      )
    }
  }

  SaveActivitie(){
    // console.log( this.SevModel );
    if( this.SevModel.SevReqUser=="" ){ this.SevModel.SevReqUser="-"; }
    if( this.SevModel.SevReqDept==null ){
      this.SevModel.SevValidation = "โปรดเลือกหน่วยงานที่แจ้งปัญหา..!";
    }else if( this.SevModel.SevReqCallBack=="-" ){
      this.SevModel.SevValidation = "โปรดระบุเบอร์ติดต่อภายใน..!";
    // }else if( this.SevModel.SevReqUser=="-" ){ this.SevModel.SevValidation = "โปรดระบุชื่อผู้แจ้งปัญหา..!";
    }else if( this.SevModel.SevReqGrpCode==null ){
      this.SevModel.SevValidation = "โปรดเลือกกิจกรรมบริการ..!";
    }else if( this.SevModel.SevReqListCode==null ){
      this.SevModel.SevValidation = "โปรดเลือกกิจกรรมรอง..!";
    }else if( this.SevModel.SevReqListSubCode==null ){
      this.SevModel.SevValidation = "โปรดเลือกกิจกรรมย่อย..!";
    }else if( this.SevModel.SevTimeAtDept==null ){
      this.SevModel.SevValidation = "โปรดระบุเวลาเริ่มกิจกรรม..!";
    }else if( this.SevModel.SevTimeDoFinish==null ){
      this.SevModel.SevValidation = "โปรดระบุเวลาเสร็จกิจกรรม..!";
    }else if( this.SevModel.SevReqMend=="-" ){
      this.SevModel.SevValidation = "โปรดระบุรายละเอียดการแก้ไขปัญหา..!";
    }else if( this.SevModel.SevTotalCase==null ){
      this.SevModel.SevValidation = "โปรดระบุจำนวนปัญหาที่แก้ไข/ครั้ง..!";
    }else if( this.SevModel.SevReqDateTime==null ){
      this.SevModel.SevValidation = "โปรดระบุจวันที่บันทึกกิจกรรม..!";
    }else{
      setTimeout(()=>{ this.loadingIndicator = true; }, 1000 );
      this.http.post(
        this.appConfig.urlApi +
        "SaveDbActivitie.php",
        { prm: this.SevModel },
        { responseType:"text" }
      ).subscribe(
        async ()=>{
          await this.GetDailyByDate();
          this.ClearValueSevModel();
          setTimeout(()=>{ this.loadingIndicator = false; }, 1500 );
          this.modalService.dismissAll( 'ServiceForm' );
        }
      )
    }
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
      // "getDbNotifiedByDate.php" +
      "getDbNotifiedWaitByYesterday.php" +
      "?dt=" + DateDb
    ).subscribe(
      async (data:any)=>{
        this.DbListNotified = data;
        // console.log( this.DbListNotified );
        await this.GetDailyByDate();
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
      "?dt=" + DateDb +
      "&us=" + this.UsCode
    ).subscribe(
      async (data:any)=>{
        this.DbListService = data;
        await this.GetActivitieByDate();
        // console.log( this.DbListService );
      }
    )
  }

  GetActivitieByDate(){
    var zYear =""+this.SearchDate.year;
        zYear = zYear.substr(2, 2);
    var DateDb=""+ zYear
                 + this.appConfig.padLeft( this.SearchDate.month, 2, "0")
                 + this.appConfig.padLeft( this.SearchDate.day, 2, "0");
    // console.log( DateDb );
    this.http.get(
      this.appConfig.urlApi +
      "getActivitieByDate.php" +
      "?dt=" + DateDb +
      "&us=" + this.UsCode
    ).subscribe(
      (data:any)=>{
        this.DbListActivitie = data;
        // console.log( this.DbListActivitie );
      }
    )
  }

  GetDailyByDate(){
    var zYear =""+this.SearchDate.year;
        zYear = zYear.substr(2, 2);
    var DateDb=""+ zYear
                 + this.appConfig.padLeft( this.SearchDate.month, 2, "0")
                 + this.appConfig.padLeft( this.SearchDate.day, 2, "0");
    // console.log( DateDb );
    this.http.get(
      this.appConfig.urlApi +
      "getDailyByDate.php" +
      "?dt=" + DateDb +
      "&us=" + this.UsCode
    ).subscribe(
       async (data:Array<any>) => {
        this.DbListDaily = data;
        this.CheckIsHoliday = await this.CheckHoliday();
        this.CheckIsHolidayOnForm = this.CheckIsHoliday;
        // console.log( this.DbListDaily );
        this.TimeSumry.TimeSum = 0;
        this.TimeSumry.TimeActn = 0;
        this.TimeSumry.TimeIncd = 0;
        this.TimeSumry.TimeDelp = 0;
        this.TimeSumry.Timeothr = 0;
        for(let index = 0; index < this.DbListDaily.length; index++){
          var ServTime :number = parseInt(this.DbListDaily[index].SevTimeTotal);
          this.TimeSumry.TimeSum = this.TimeSumry.TimeSum + ServTime;
          if(this.DbListDaily[index].SevTypeHA=='Activitie'){
            this.TimeSumry.TimeActn = this.TimeSumry.TimeActn + ServTime;
          }else if(this.DbListDaily[index].SevTypeHA=='Incedent'){
            this.TimeSumry.TimeIncd = this.TimeSumry.TimeIncd + ServTime;
          }else if(this.DbListDaily[index].SevTypeHA=='Develop'){
            this.TimeSumry.TimeDelp = this.TimeSumry.TimeDelp + ServTime;
          }else{
            this.TimeSumry.Timeothr = this.TimeSumry.Timeothr + ServTime;
          }
        }
        // console.log( this.TimeSumry );
      }
    )
  }

  SetOnMyWay( zIndex ){
    swal({
      title: 'คุณแน่ใจหรือ ?',
      text: "คุณต้องการจองรายการนี้. ในคิวงานของคุณใช่หรือไม่!",
      type: 'warning',
      allowOutsideClick: false,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: '#0CC27E',
      cancelButtonColor: '#FF586B',
      confirmButtonText: '<i class="icon icon-check"></i> ใช่, ฉันแน่ใจ',
      cancelButtonText: '<i class="icon icon-close"></i> ไม่, ยกเลิก',
      confirmButtonClass: 'btn btn-success btn-raised mr-5',
      cancelButtonClass: 'btn btn-danger btn-raised',
      buttonsStyling: true
    }).then(async isConfirm => {
      if( isConfirm.value ){
        await this.http.post(
          this.appConfig.urlApi + "SaveNotfOnMyWay.php",
          { prm: this.DbListNotified[zIndex], urs: this.UsCode },
          { responseType: "text" }
        ).subscribe(
          async ()=>{
            // console.log(data);
            await this.GetDbNotifiedByDate();
            swal({
              title: 'ยืนยันการจองคิวแล้ว ?',
              text: 'ปัญหาที่ได้รับการแจ้งนี้ ได้อยู่ในคิวการแก้ไขของคุณแล้ว',
              type: 'success',
              allowOutsideClick: false,
              showConfirmButton: true,
              buttonsStyling: true,
              confirmButtonColor: '#0CC27E',
              confirmButtonText: '<i class="icon icon-star"></i> ตกลง',
              confirmButtonClass: 'btn btn-success btn-raised mr-5'
            });
          }
        )
      }
    });
  }

  DeleteNotified( zIndex ){
    var NotifCode = this.DbListNotified[zIndex].SevCode;
    swal({
      title: 'แจ้งเตือน.!',
      text: "คุณต้องการลบรายการนี้ จากรายการรับแจ้งปัญหาใช่หรือไม่!",
      type: 'question',
      allowOutsideClick: false,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: '#0CC27E',
      cancelButtonColor: '#FF586B',
      confirmButtonText: '<i class="icon icon-check"></i> ใช่, ฉันแน่ใจ',
      cancelButtonText: '<i class="icon icon-close"></i> ไม่, ยกเลิก',
      confirmButtonClass: 'btn btn-success btn-raised mr-5',
      cancelButtonClass: 'btn btn-danger btn-raised',
      buttonsStyling: true
    }).then(async isConfirm => {
      if( isConfirm.value ){
        await this.http.post(
          this.appConfig.urlApi + "DeleteNotified.php",
          { nfc: NotifCode },
          { responseType: "text" }
        ).subscribe(
          async ()=>{
            // console.log(data);
            await this.GetDbNotifiedByDate();
            swal({
              title: 'ยืนยันการจองคิวแล้ว ?',
              text: 'ปัญหาที่ได้รับการแจ้งนี้ ได้อยู่ในคิวการแก้ไขของคุณแล้ว',
              type: 'success',
              allowOutsideClick: false,
              showConfirmButton: true,
              buttonsStyling: true,
              confirmButtonColor: '#0CC27E',
              confirmButtonText: '<i class="icon icon-star"></i> ตกลง',
              confirmButtonClass: 'btn btn-success btn-raised mr-5'
            });
          }
        )
      }
    });
  }

  DeleteService( zIndex ){
    var SevCode = this.DbListService[zIndex].SevCode;
    swal({
      title: 'แจ้งเตือน.!',
      text: "คุณต้องการลบรายการนี้..จากข้อมูลบริการของคุณหรือไม่.",
      type: 'question',
      allowOutsideClick: false,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: '#0CC27E',
      cancelButtonColor: '#FF586B',
      confirmButtonText: '<i class="icon icon-check"></i> ใช่, ฉันแน่ใจ',
      cancelButtonText: '<i class="icon icon-close"></i> ไม่, ยกเลิก',
      confirmButtonClass: 'btn btn-success btn-raised mr-5',
      cancelButtonClass: 'btn btn-danger btn-raised',
      buttonsStyling: true
    }).then(async isConfirm => {
      if( isConfirm.value ){
        await this.http.post(
          this.appConfig.urlApi + "DeleteService.php",
          { nfc: SevCode },
          { responseType: "text" }
        ).subscribe(
          async ()=>{
            // console.log(data);
            await this.GetDailyByDate();
            swal({
              title: 'ยืนยันการลบข้อมูลบริการ !!',
              text: 'ระบบได้ดำเนินการลบข้อมูลบริการ.. เสร็จสมบูรณ์แล้ว',
              type: 'success',
              allowOutsideClick: false,
              showConfirmButton: true,
              buttonsStyling: true,
              confirmButtonColor: '#0CC27E',
              confirmButtonText: '<i class="icon icon-star"></i> ตกลง',
              confirmButtonClass: 'btn btn-success btn-raised mr-5'
            });
          }
        )
      }
    });
  }

  CalTimeServ(){
    // if(this.SevModel.SevTimeReqTel!=null &&
    //   this.SevModel.SevTimeAtDept==null){
    //    this.SevModel.SevTimeAtDept = this.SevModel.SevTimeReqTel;
    // }else
    // if(this.SevModel.SevTimeDoFinish!=null &&
    //   this.SevModel.SevTimeSdWork==null){
    //    this.SevModel.SevTimeSdWork = this.SevModel.SevTimeDoFinish;
    // }
    if(this.SevModel.SevTimeReqTel!=null &&
       this.SevModel.SevTimeSdWork!=null){
        var TimeBegin = this.SevModel.SevTimeReqTel;
        var TimeEnd = this.SevModel.SevTimeSdWork;
        var CalTime = this.appConfig.GetDiffTime( TimeBegin, TimeEnd );
        this.SevModel.SevTimeTotal = "" + CalTime;
    }else
    if(this.SevModel.SevTimeReqTel!=null &&
       this.SevModel.SevTimeDoFinish!=null){
        var TimeBegin = this.SevModel.SevTimeReqTel;
        var TimeEnd = this.SevModel.SevTimeDoFinish;
        var CalTime = this.appConfig.GetDiffTime( TimeBegin, TimeEnd );
        this.SevModel.SevTimeTotal = "" + CalTime;
    }else
    if(this.SevModel.SevTimeAtDept!=null &&
      this.SevModel.SevTimeSdWork!=null){
      var TimeBegin = this.SevModel.SevTimeAtDept;
      var TimeEnd = this.SevModel.SevTimeSdWork;
      var CalTime = this.appConfig.GetDiffTime( TimeBegin, TimeEnd );
      this.SevModel.SevTimeTotal = "" + CalTime;
    }else
    if(this.SevModel.SevTimeAtDept!=null &&
      this.SevModel.SevTimeDoFinish!=null){
      var TimeBegin = this.SevModel.SevTimeAtDept;
      var TimeEnd = this.SevModel.SevTimeDoFinish;
      var CalTime = this.appConfig.GetDiffTime( TimeBegin, TimeEnd );
      this.SevModel.SevTimeTotal = "" + CalTime;
    }else{
      this.SevModel.SevTimeTotal = "0";
    }
   // console.log( this.SevModel.SevTimeReqTel );
  }

  CallFromTimeStart(Firsttime:any){
    var TimeBegin = "0700";
    var TimeEnd = Firsttime;
    var CalTime = this.appConfig.GetDiffTime( TimeBegin, TimeEnd );
    return CalTime;
  }

  SaveServiceFromNotified( zIndex, content ){
    swal({
      title: 'คุณแน่ใจหรือ ?',
      text: "คุณต้องการบันทึกรายการแจ้งปัญหานี้. ในข้อมูลงานบริการของคุณใช่หรือไม่!",
      type: 'warning',
      allowOutsideClick: false,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: '#0CC27E',
      cancelButtonColor: '#FF586B',
      confirmButtonText: '<i class="icon icon-check"></i> ใช่, ฉันแน่ใจ',
      cancelButtonText: '<i class="icon icon-close"></i> ไม่, ยกเลิก',
      confirmButtonClass: 'btn btn-success btn-raised mr-5',
      cancelButtonClass: 'btn btn-danger btn-raised',
      buttonsStyling: true
    }).then(async isConfirm => {
      if( isConfirm.value ){
        // console.log( this.DbListNotified[zIndex] );
        this.SevModel.SevAction = 'E';
        this.SevModel.SevHaType = 'Incedent';
        this.SevModel.SevType = 'S';
        this.SevModel.SevCode = this.DbListNotified[zIndex].SevCode;
        this.SevModel.SevReqDept = this.DbListNotified[zIndex].SevReqDept;
        this.SevModel.SevReqCallBack = this.DbListNotified[zIndex].SevReqCallBack;
        this.SevModel.SevReqUser = this.DbListNotified[zIndex].SevReqUser;
        this.SevModel.SevReqGrpCode = this.DbListNotified[zIndex].SevReqGrpCode;
        this.SevModel.SevReqListCode = this.DbListNotified[zIndex].SevReqListCode;
        this.SevModel.SevReqListSubCode = this.DbListNotified[zIndex].SevReqListSubCode;
        this.SevModel.SevReqProblem = this.DbListNotified[zIndex].SevReqProblem;
        this.SevModel.SevReqProblemPoint = this.DbListNotified[zIndex].SevReqProblemPoint;
        this.SevModel.SevReqMend = this.DbListNotified[zIndex].SevReqMend;
        if(this.DbListNotified[zIndex].SevTimeReqTel=='-'){
          this.SevModel.SevTimeReqTel = null;
        }else{
          this.SevModel.SevTimeReqTel = this.DbListNotified[zIndex].SevTimeReqTel;
        }
        if(this.DbListNotified[zIndex].SevTimeAtDept=='-'){
          this.SevModel.SevTimeAtDept = null;
        }else{
          this.SevModel.SevTimeAtDept = this.DbListNotified[zIndex].SevTimeAtDept;
        }
        if(this.DbListNotified[zIndex].SevTimeDoFinish=='-'){
          this.SevModel.SevTimeDoFinish = null;
        }else{
          this.SevModel.SevTimeDoFinish = this.DbListNotified[zIndex].SevTimeDoFinish;
        }
        this.SevModel.SevTimeTotal = '0';
        this.SevModel.SevTotalCase = '1';
        this.SevModel.SevUserMend = new Array( this.UsCode );
        this.SevModel.SevUserName = this.UsFName;
        this.SevModel.SevReqDateTime = this.appConfig.ConvDb2DateYMD( this.DbListNotified[zIndex].SevDateSave );
        this.SevModel.SevProductCode = this.DbListNotified[zIndex].SevProductCode;
        this.SevModel.SevValidation = "-";
        this.ShowModal( content );
      }
    });
  }

  SetServiceUpdate( zIndex, content ){
    swal({
      title: 'คุณแน่ใจหรือไม่ ?',
      text: "คุณต้องการแก้ไขข้อมูลบริการนี้. ในงานบริการของคุณใช่หรือไม่!",
      type: 'question',
      allowOutsideClick: false,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: '#0CC27E',
      cancelButtonColor: '#FF586B',
      confirmButtonText: '<i class="icon icon-check"></i> ใช่, ฉันแน่ใจ',
      cancelButtonText: '<i class="icon icon-close"></i> ไม่, ยกเลิก',
      confirmButtonClass: 'btn btn-success btn-raised mr-5',
      cancelButtonClass: 'btn btn-danger btn-raised',
      buttonsStyling: true
    }).then(async isConfirm => {
      if( isConfirm.value ){
        // console.log( this.DbListService[zIndex] );
        var CurUser = new Array();
        CurUser = [this.DbListService[zIndex].SevUserMend];
        this.ActionHUser = '-';
        this.SevModel.SevAction = 'E';
        this.SevModel.SevType = 'S';
        this.SevModel.SevHaType = this.DbListService[zIndex].SevHaType;
        this.SevModel.SevIsRisk = this.DbListService[zIndex].SevIsRisk;
        this.SevModel.SevCode = this.DbListService[zIndex].SevCode;
        this.SevModel.SevReqDept = this.DbListService[zIndex].SevReqDept;
        this.SevModel.SevReqCallBack = this.DbListService[zIndex].SevReqCallBack;
        this.SevModel.SevReqUser = this.DbListService[zIndex].SevReqUser;
        this.SevModel.SevReqGrpCode = this.DbListService[zIndex].SevReqGrpCode;
        this.GetActionHByActCode(this.SevModel.SevReqGrpCode);
        this.SevModel.SevReqListCode = this.DbListService[zIndex].SevReqListCode;
        this.GetActionDByActHCode(this.SevModel.SevReqListCode);
        this.SevModel.SevReqListSubCode = this.DbListService[zIndex].SevReqListSubCode;
        this.SevModel.SevReqProblem = this.DbListService[zIndex].SevReqProblem;
        this.SevModel.SevReqProblemPoint = this.DbListService[zIndex].SevReqProblemPoint;
        this.SevModel.SevReqMend = this.DbListService[zIndex].SevReqMend;
        if(this.DbListService[zIndex].SevTimeReqTel=='-'){
          this.SevModel.SevTimeReqTel = null;
        }else{
          this.SevModel.SevTimeReqTel = this.DbListService[zIndex].SevTimeReqTel;
        }
        if(this.DbListService[zIndex].SevTimeAtDept=='-'){
          this.SevModel.SevTimeAtDept = null;
        }else{
          this.SevModel.SevTimeAtDept = this.DbListService[zIndex].SevTimeAtDept;
        }
        if(this.DbListService[zIndex].SevTimeDoFinish=='-'){
          this.SevModel.SevTimeDoFinish = null;
        }else{
          this.SevModel.SevTimeDoFinish = this.DbListService[zIndex].SevTimeDoFinish;
        }
        this.SevModel.SevTimeTotal = this.DbListService[zIndex].SevTimeTotal;
        this.SevModel.SevTotalCase = this.DbListService[zIndex].SevTotalCase;
        this.SevModel.SevUserMend = CurUser; //this.DbListService[zIndex].SevUserMend.split(",");
        this.SevModel.SevUserName = this.UsFName;
        this.SevModel.SevReqDateTime = this.appConfig.ConvDb2DateYMD( this.DbListService[zIndex].SevDateSave );
        this.SevModel.SevProductCode = this.DbListService[zIndex].SevProductCode;
        this.SevModel.SevProblemGroup = this.DbListService[zIndex].SevProblemGroup;
        this.SevModel.SevValidation = "-";
        this.ShowModal( content );
      }
    });
  }

  SetServiceUpdate2( item:any, content ){
    swal({
      title: 'คุณต้องการแก้ไขข้อมูลบริการนี้.\nในงานบริการของคุณใช่หรือไม่!',
      text: "", type: 'question', allowOutsideClick: false,
      showConfirmButton: true, showCancelButton: true,
      confirmButtonColor: '#0CC27E', cancelButtonColor: '#FF586B',
      confirmButtonText: '<i class="icon icon-check"></i> ใช่, ฉันแน่ใจ',
      cancelButtonText: '<i class="icon icon-close"></i> ไม่, ยกเลิก',
      confirmButtonClass: 'btn btn-success btn-raised mr-5',
      cancelButtonClass: 'btn btn-danger btn-raised',
      buttonsStyling: true
    }).then(async isConfirm => {
      if( isConfirm.value ){
        // console.log( item );
        this.GetActivitieByPosType( "AL" );
        this.ActionHUser = '-';
        this.SevModel.SevAction = 'E';
        this.SevModel.SevType = 'S';
        this.SevModel.SevHaType = item.SevTypeHA;
        this.SevModel.SevIsRisk = item.SevIsRisk;
        this.SevModel.SevCode = item.SevCode;
        this.SevModel.SevReqDept = item.SevReqDept;
        this.SevModel.SevReqCallBack = item.SevReqCallBack;
        this.SevModel.SevReqUser = item.SevReqUser;
        this.SevModel.SevReqGrpCode = item.SevReqGrpCode;
        this.GetActionHByActCode(this.SevModel.SevReqGrpCode);
        this.SevModel.SevReqListCode = item.SevReqListCode;
        this.GetActionDByActHCode(this.SevModel.SevReqListCode);
        this.SevModel.SevReqListSubCode = item.SevReqListSubCode;
        this.SevModel.SevReqProblem = item.SevReqProblem;
        this.SevModel.SevReqProblemPoint = item.SevReqProblemPoint;
        this.SevModel.SevReqMend = item.SevReqMend;
        if(item.SevTimeReqTel=='-'){
          this.SevModel.SevTimeReqTel = null;
        }else{
          this.SevModel.SevTimeReqTel = item.SevTimeReqTel;
        }
        if(item.SevTimeAtDept=='-'){
          this.SevModel.SevTimeAtDept = null;
        }else{
          this.SevModel.SevTimeAtDept = item.SevTimeAtDept;
        }
        if(item.SevTimeDoFinish=='-'){
          this.SevModel.SevTimeDoFinish = null;
        }else{
          this.SevModel.SevTimeDoFinish = item.SevTimeDoFinish;
        }
        this.SevModel.SevTimeTotal = item.SevTimeTotal;
        this.SevModel.SevTotalCase = item.SevTotalCase;
        this.SevModel.SevUserName = this.UsFName;
        this.SevModel.SevReqDateTime = this.appConfig.ConvDb2DateYMD( item.SevDateSave );
        this.SevModel.SevProductCode = item.SevProductCode;
        this.SevModel.SevProblemGroup = item.SevProblemGroup;
        this.SevModel.SevValidation = "-";
        var ChkComma = this.appConfig.FindCharInString(",",item.SevUserMend);
        if(ChkComma>0){
          this.SevModel.SevUserMend = item.SevUserMend.substring(0,item.SevUserMend.length).split(",");
        }else{
          var CurUser = new Array();
          CurUser = [item.SevUserMend];
          this.SevModel.SevUserMend = CurUser;
        }
        this.ShowModal( content );
      }
    });
  }

  SetActivitieUpdate( zIndex, content ){
    swal({
      title: 'คุณแน่ใจหรือไม่ ?',
      text: "คุณต้องการแก้ไขข้อมูลกิจกรรมนี้. ในรายการกิจกรรมของคุณใช่หรือไม่!",
      type: 'question',
      allowOutsideClick: false,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: '#0CC27E',
      cancelButtonColor: '#FF586B',
      confirmButtonText: '<i class="icon icon-check"></i> ใช่, ฉันแน่ใจ',
      cancelButtonText: '<i class="icon icon-close"></i> ไม่, ยกเลิก',
      confirmButtonClass: 'btn btn-success btn-raised mr-5',
      cancelButtonClass: 'btn btn-danger btn-raised',
      buttonsStyling: true
    }).then(async isConfirm => {
      if( isConfirm.value ){
        // console.log( this.DbListActivitie[zIndex] );
        var CurUser = new Array();
        CurUser = [this.DbListActivitie[zIndex].SevUserMend];
        this.SevModel.SevAction = 'E';
        this.SevModel.SevType = 'S';
        this.SevModel.SevCode = this.DbListActivitie[zIndex].SevCode;
        this.SevModel.SevReqDept = this.DbListActivitie[zIndex].SevReqDept;
        this.SevModel.SevReqCallBack = this.DbListActivitie[zIndex].SevReqCallBack;
        this.SevModel.SevReqUser = this.DbListActivitie[zIndex].SevReqUser;
        this.SevModel.SevReqGrpCode = this.DbListActivitie[zIndex].SevReqGrpCode;
        this.GetActionHByActCode(this.SevModel.SevReqGrpCode);
        this.SevModel.SevReqListCode = this.DbListActivitie[zIndex].SevReqListCode;
        this.GetActionDByActHCode(this.SevModel.SevReqListCode);
        this.SevModel.SevReqListSubCode = this.DbListActivitie[zIndex].SevReqListSubCode;
        this.SevModel.SevReqProblem = this.DbListActivitie[zIndex].SevReqProblem;
        this.SevModel.SevReqProblemPoint = this.DbListActivitie[zIndex].SevReqProblemPoint;
        this.SevModel.SevReqMend = this.DbListActivitie[zIndex].SevReqMend;
        if(this.DbListActivitie[zIndex].SevTimeReqTel=='-'){
          this.SevModel.SevTimeReqTel = null;
        }else{
          this.SevModel.SevTimeReqTel = this.DbListActivitie[zIndex].SevTimeReqTel;
        }
        if(this.DbListActivitie[zIndex].SevTimeAtDept=='-'){
          this.SevModel.SevTimeAtDept = null;
        }else{
          this.SevModel.SevTimeAtDept = this.DbListActivitie[zIndex].SevTimeAtDept;
        }
        if(this.DbListActivitie[zIndex].SevTimeDoFinish=='-'){
          this.SevModel.SevTimeDoFinish = null;
        }else{
          this.SevModel.SevTimeDoFinish = this.DbListActivitie[zIndex].SevTimeDoFinish;
        }
        this.SevModel.SevTimeTotal = this.DbListActivitie[zIndex].SevTimeTotal;
        this.SevModel.SevTotalCase = this.DbListActivitie[zIndex].SevTotalCase;
        this.SevModel.SevUserMend = CurUser; // this.UsCode;
        this.SevModel.SevUserName = this.UsFName;
        this.SevModel.SevReqDateTime = this.appConfig.ConvDb2DateYMD( this.DbListActivitie[zIndex].SevDateSave );
        this.SevModel.SevProductCode = this.DbListActivitie[zIndex].SevProductCode;
        this.SevModel.SevProblemGroup = this.DbListService[zIndex].SevProblemGroup;
        this.SevModel.SevValidation = "-";
        this.ShowModal( content );
      }
    });
  }

  SetActivitieUpdate2( item:any, content ){
    swal({
      title: 'คุณต้องการแก้ไขข้อมูลกิจกรรมนี้.\nในรายการกิจกรรมของคุณใช่หรือไม่!',
      text: "", type: 'question', allowOutsideClick: false,
      showConfirmButton: true, showCancelButton: true,
      confirmButtonColor: '#0CC27E', cancelButtonColor: '#FF586B',
      confirmButtonText: '<i class="icon icon-check"></i> ใช่, ฉันแน่ใจ',
      cancelButtonText: '<i class="icon icon-close"></i> ไม่, ยกเลิก',
      confirmButtonClass: 'btn btn-success btn-raised mr-5',
      cancelButtonClass: 'btn btn-danger btn-raised',
      buttonsStyling: true
    }).then(async isConfirm => {
      if( isConfirm.value ){
        // console.log( item );
        this.GetActivitieByPosType( this.UsPosCode );
        this.SevModel.SevAction = 'E';
        this.SevModel.SevType = 'S';
        this.SevModel.SevCode = item.SevCode;
        this.SevModel.SevReqDept = item.SevReqDept;
        this.SevModel.SevReqCallBack = item.SevReqCallBack;
        this.SevModel.SevReqUser = item.SevReqUser;
        this.SevModel.SevReqGrpCode = item.SevReqGrpCode;
        this.GetActionHByActCode(this.SevModel.SevReqGrpCode);
        this.SevModel.SevReqListCode = item.SevReqListCode;
        this.GetActionDByActHCode(this.SevModel.SevReqListCode);
        this.SevModel.SevReqListSubCode = item.SevReqListSubCode;
        this.SevModel.SevReqProblem = item.SevReqProblem;
        this.SevModel.SevReqProblemPoint = item.SevReqProblemPoint;
        this.SevModel.SevReqMend = item.SevReqMend;
        if(item.SevTimeReqTel=='-'){
          this.SevModel.SevTimeReqTel = null;
        }else{
          this.SevModel.SevTimeReqTel = item.SevTimeReqTel;
        }
        if(item.SevTimeAtDept=='-'){
          this.SevModel.SevTimeAtDept = null;
        }else{
          this.SevModel.SevTimeAtDept = item.SevTimeAtDept;
        }
        if(item.SevTimeDoFinish=='-'){
          this.SevModel.SevTimeDoFinish = null;
        }else{
          this.SevModel.SevTimeDoFinish = item.SevTimeDoFinish;
        }
        this.SevModel.SevTimeTotal = item.SevTimeTotal;
        this.SevModel.SevTotalCase = item.SevTotalCase;
        this.SevModel.SevUserName = this.UsFName;
        this.SevModel.SevReqDateTime = this.appConfig.ConvDb2DateYMD( item.SevDateSave );
        this.SevModel.SevProductCode = item.SevProductCode;
        this.SevModel.SevProblemGroup = item.SevProblemGroup;
        this.SevModel.SevValidation = "-";
        var ChkComma = this.appConfig.FindCharInString(",",item.SevUserMend);
        if(ChkComma>0){
          this.SevModel.SevUserMend = item.SevUserMend.substring(0,item.SevUserMend.length).split(",");
        }else{
          var CurUser = new Array();
          CurUser = [item.SevUserMend];
          this.SevModel.SevUserMend = CurUser;
        }
        this.ShowModal( content );
      }
    });
  }

  DeleteActivitie( item:any ){
    var SevCode = item.SevCode;
    // console.log( SevCode );
    swal({
      title: 'แจ้งเตือน.!',
      text: "คุณต้องการลบรายการนี้..จากรายการกิจกรรมของคุณหรือไม่.",
      type: 'question',
      allowOutsideClick: false,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: '#0CC27E',
      cancelButtonColor: '#FF586B',
      confirmButtonText: '<i class="icon icon-check"></i> ใช่, ฉันแน่ใจ',
      cancelButtonText: '<i class="icon icon-close"></i> ไม่, ยกเลิก',
      confirmButtonClass: 'btn btn-success btn-raised mr-5',
      cancelButtonClass: 'btn btn-danger btn-raised',
      buttonsStyling: true
    }).then(async isConfirm => {
      if( isConfirm.value ){
        await this.http.post(
          this.appConfig.urlApi +
          "DeleteService.php",
          { nfc: SevCode },
          { responseType: "text" }
        ).subscribe(
          async ()=>{
            // console.log(data);
            await this.GetDailyByDate();
            swal({
              title: 'ระบบได้ดำเนินการลบข้อมูลกิจกรรม.. เสร็จสมบูรณ์แล้ว',
              text:  'ยืนยันการลบข้อมูลกิจกรรม !!', type: 'success',
              allowOutsideClick: false, showConfirmButton: true,
              buttonsStyling: true, confirmButtonColor: '#0CC27E',
              confirmButtonText: '<i class="icon icon-star"></i> ตกลง',
              confirmButtonClass: 'btn btn-success btn-raised mr-5'
            });
          }
        )
      }
    });
  }

  ShowActivitieInfo( content, item:any ){
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

  CheckHoliday(){
    const promise =  new Promise<boolean>((res:any, rej:any)=>{
      var zYear = '';
      var DateDb = '';
      zYear = '' + this.SearchDate.year;
      zYear = zYear.substr(0,4);
      DateDb = '' + zYear +
               this.appConfig.padLeft(this.SearchDate.month,2,'0') +
               this.appConfig.padLeft(this.SearchDate.day,2,'0');
      // console.log( DateDb );
      this.http.get(
        this.appConfig.urlApi +
        'getHolidayHomc.php' +
        '?cdate=' + DateDb
      ).toPromise().then(
        (data:any)=>{
          // console.log( data );
          res(data);
        }
      ),error=>rej(false)
    });
    return promise;
  }

  CheckHoliday2(cDate){
    // yyyymmdd
    const promise =  new Promise<boolean>((res:any, rej:any)=>{
      this.http.get(
        this.appConfig.urlApi +
        'getHolidayHomc.php' +
        '?cdate=' + cDate
      ).toPromise().then(
        (data:any)=>{
          // console.log( data );
          res(data);
        }
      ),error=>rej(false)
    });
    return promise;
  }

  async OnChangeDatePicker(event){
    // console.log(event);
    this.CheckIsHoliday = await this.CheckHoliday();
    // console.log(this.CheckIsHoliday);
  }

  async OnChangeDateEdit(event){
    // console.log(event);
    var zDate: string;
    zDate = event.substr(0,4) + event.substr(5,2) + event.substr(8,2);
    // console.log(zDate);
    this.CheckIsHolidayOnForm = await this.CheckHoliday2(zDate);
    // console.log(this.CheckIsHolidayOnForm);
    if( this.CheckIsHolidayOnForm==true ){
      swal({
        title: 'ระบบงดการบันทึกกิจกรรมใด ๆ\nในช่วงวันหยุดและนอกเวลาราชการ',
        text: '', type: 'warning',
        allowOutsideClick: false, showConfirmButton: true,
        buttonsStyling: true, confirmButtonColor: '#0CC27E',
        confirmButtonText: '<i class="icon icon-star"></i> ตกลง',
        confirmButtonClass: 'btn btn-success btn-raised mr-5'
      });
    }
  }

}
