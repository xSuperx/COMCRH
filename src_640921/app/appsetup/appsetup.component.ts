import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'app/shared/configs/app-config';
import { NgbModal, NgbModalConfig, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
import { NgSelectConfig } from '@ng-select/ng-select';

@Component({
  selector: 'app-appsetup',
  templateUrl: './appsetup.component.html',
  styleUrls: ['./appsetup.component.scss']
})

export class AppsetupComponent implements OnInit {
  constructor(
    private http :HttpClient,
    private appConfig :AppConfig,
    private modalService :NgbModal,
    private config :NgbModalConfig,
    private calendar: NgbCalendar
  )
  {
    config.backdrop = 'static';
    config.keyboard = false;
    setTimeout( () => { this.loadingIndicator = false; }, 1500 );
  }

  PrmModel = {
    AcHDevUser:'-', AcHGroup:'-', AcHCode:'-',
    AcHName:'-', AcHSub:'-', AcHUses:'Y', AcHState:'N'
  }

  MduModel = {
    AcHCode:'-', AcDCode:'-', AcDName:'-',
    AcDUses:'Y', AcDState:'N', AcDDevUser:'-'
  }

  ActModel = {
    ActCode:'-', ActName:'-', ActMeans:'-', ActType:null, EmpType:null,
    TimeInsure:'-', TimeInsureUnit:'-', TimeP4P:'-', TimeP4PUnit:'-',
    ActUses:'Y', ActSet:'-', SevAction:'N'
  }

  LstUseFlag = [
    {id: 'Y', name: 'ใช้งาน'},
    {id: 'N', name: 'ยกเลิก'}
  ];

  loadingIndicator :boolean = true;
  UsCode :string;
  UsFName :string;
  UsPosCode :string;
  UsAdmin :string;
  ActionHUser :string;
  SelectActivit :string;
  SelectActHead :string;
  SelectActSubs :string;
  SelectProgram :string;
  RowPerPage = 10;
  PagesMain = 1;
  PagesHead = 1;
  PagesSubs = 1;

  ShowFormHead = 0;
  ShowFormSubs = 0;

  DbActionH = [];
  DbActionD = [];
  DbActivities = [];
  DbDeptPhone = [];
  DbEmpType = [];
  DbActType = [];
  DbProgram = [];
  DbModules = [];

  ngOnInit(){
    this.SelectActivit = "";
    this.SelectActHead = "";
    this.SelectActSubs = "";
    this.UsCode = localStorage.getItem( 'LgUserCode' );
    this.UsFName = localStorage.getItem( 'LgUsrFullName' );
    this.UsPosCode = localStorage.getItem( 'LgUsrPosCode' );
    this.UsAdmin = localStorage.getItem( 'LgUsrAdmin' );
    this.GetDeptAndPhone();
    if(this.UsPosCode =='PM'){
      //this.ActionHUser = this.UsCode;
      this.ActionHUser = this.UsPosCode;
      this.GetProgramByActCodeUsCode(this.UsCode);
      this.GetActivitiesByEmpType('*');
    }else{
      this.ActionHUser = "-";
    }
    // console.log( localStorage );
  }

  ShowModal( content ) {
    this.modalService.open( content, {size:'lg'} );
  }

  GetActivitiesByEmpType( EmpType :string ){
    this.http.get(
      this.appConfig.urlApi +
      "getActivities.php" +
      "?et=" + EmpType
    ).subscribe(
      (data:any)=>{
        this.DbActivities = data;
        // console.log( this.DbActivities );
      }
    )
  }

  GetDeptAndPhone(){
    this.http.get(
      this.appConfig.urlApi +
      "getDeptPhone.php"
    ).subscribe(
      (data:any)=>{
        this.DbDeptPhone = data;
        // console.log( this.DbDeptPhone );
        this.GetActionType();
      }
    )
  }

  GetEmprotyeeType(){
    this.http.get(
      this.appConfig.urlApi +
      "getEmprotyeeType.php"
    ).subscribe(
      (data:any)=>{
        this.DbEmpType = data;
        // console.log( this.DbEmpType );
      }
    )
  }

  GetActionType(){
    this.http.get(
      this.appConfig.urlApi +
      "getActionType.php"
    ).subscribe(
      (data:any)=>{
        this.DbActType = data;
        // console.log( this.DbActType );
        this.GetEmprotyeeType();
      }
    )
  }

  UpdateDeptPhone( zIndex :number ){
    var DeptCode, DeptPhone: any;
    DeptPhone = (<HTMLInputElement>document.getElementById("edptphne"+zIndex)).value;
    DeptCode = this.DbDeptPhone[zIndex].ORGCODE;
    // this.DbDeptPhone[zIndex].Phone = DeptPhone;
    // console.log( this.DbDeptPhone );
    this.http.post(
      this.appConfig.urlApi + "UpdateDeptPhone.php",
      { dpcode:DeptCode, dpphone:DeptPhone },
      { responseType:"text" }
    ).subscribe(
      async ()=>{
        await this.GetDeptAndPhone();
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
        console.log( this.DbActionH );
        //this.GetActivitieByPosType( this.UsPosCode );
      }
    )
  }

  GetActionHByActCodeUsCode( ActivitieCode, ActUserCode :string ){
    this.SelectActHead = ActivitieCode;
    this.http.get(
      this.appConfig.urlApi +
      "getActionHByActCodeUsCode.php" +
      "?ac=" + ActivitieCode +
      "&au=" + ActUserCode
    ).subscribe(
      (data:any)=>{
        this.DbActionH = data;
        // console.log( this.DbActionH );
        var RowCnt = this.DbActionH.length;
        if(RowCnt>0){
          this.GetActionDByActCodeUsCode(this.DbActionH[0].AcHSub);
        }
      }
    )
  }

  GetProgramByActCodeUsCode( ActUserCode :string ){
    this.http.get(
      this.appConfig.urlApi +
      "getProgramByUsCode.php?au=PM"
      // "?au=" + ActUserCode
    ).subscribe(
      (data:any)=>{
        this.DbProgram = data;
        // console.log( this.DbProgram );
        var RowCnt = this.DbProgram.length;
        if(RowCnt>0){
          this.SelectProgram = this.DbProgram[0].AcHName;
          this.GetModuleByPrmCode( this.DbProgram[0].AcHSub,
                                   this.DbProgram[0].AcHName,
                                   ActUserCode );
        }
      }
    )
  }

  GetActionDByActHCode( ActHCode :string ){
    this.SelectActHead = ActHCode;
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

  GetActionDByActCodeUsCode( ActHCode :string ){
    this.SelectActSubs = ActHCode;
    this.http.get(
      this.appConfig.urlApi +
      "getActionDByActCodeUsCode.php" +
      "?ac=" + ActHCode
    ).subscribe(
      (data:any)=>{
        this.DbActionD = data;
        // console.log( this.DbActionD );
      }
    )
  }

  GetModuleByPrmCode( ActHCode, ActHName, ActUser :string ){
    this.SelectActSubs = ActHCode;
    this.SelectProgram = ActHName;
    this.http.get(
      this.appConfig.urlApi +
      "getModuleByPrmCode.php" +
      "?ac=" + ActHCode +
      "&au=" + ActUser
    ).subscribe(
      (data:any)=>{
        this.DbModules = data;
        // console.log( this.DbModules );
      }
    )
  }

  UpdateActivitie( Index:any, Content ){
    // var NotifCode = this.DbActivities[Index].SevCode;
    swal({
      title: 'แจ้งเตือน.!',
      text: "คุณต้องการปรับปรุงข้อมูลรายการนี้...หรือไม่!",
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
        console.log( Index );
        this.ActModel.SevAction = 'E';
        this.SelectActivit = Index.ActCode;
        this.ActModel.ActCode = Index.ActCode;
        this.ActModel.ActName = Index.ActName;
        this.ActModel.ActMeans = Index.ActMeans;
        this.ActModel.ActType = Index.ActType;
        this.ActModel.EmpType = Index.EmpType;
        this.ActModel.TimeInsure = Index.TimeInsure;
        this.ActModel.TimeInsureUnit = Index.TimeInsureUnit;
        this.ActModel.TimeP4P = Index.TimeP4P;
        this.ActModel.TimeP4PUnit = Index.TimeP4PUnit;
        this.ActModel.ActUses = Index.ActUses;
        this.ActModel.ActSet = Index.ActSet;
        // console.log( this.ActModel );
        this.GetActionHByActCodeUsCode( this.ActModel.ActSet, "-" );
        this.ShowModal( Content );
      }
    });
  }

  SaveUpdateActivitie(){
    // console.log( this.ActModel );
    this.http.post(
      this.appConfig.urlApi + "SaveUpdateActivitie.php",
      { prm: this.ActModel },{ responseType:"text" }
    ).subscribe(
      async ()=>{
        await this.GetActivitiesByEmpType('*');
        this.modalService.dismissAll( 'ActivitieForm' );
      }
    )
  }

  FormSystemData( NewState:string, zIndex:any ){
    if(NewState=='N'){
      swal({
        title: "คุณต้องการเพิ่มข้อมูลโปรแกรมหรือระบบใหม่\nหรือไม่!",
        text: "", type: 'question', allowOutsideClick: false,
        showConfirmButton: true, showCancelButton: true,
        confirmButtonColor: '#0CC27E', cancelButtonColor: '#FF586B',
        confirmButtonText: '<i class="icon icon-check"></i> ใช่, ฉันจะเพิ่ม',
        cancelButtonText: '<i class="icon icon-close"></i> ไม่, ยกเลิก',
        confirmButtonClass: 'btn btn-success btn-raised mr-5',
        cancelButtonClass: 'btn btn-danger btn-raised',
        buttonsStyling: true
      }).then(async isConfirm => {
        if( isConfirm.value ){
          var TotalRow :number;
          var LastID :string;
          if(this.DbProgram.length==0){
            TotalRow = 0;
            LastID = "1001";
            this.PrmModel.AcHDevUser = 'PM'; //this.UsCode;
            this.PrmModel.AcHGroup = "DV001";
          }else{
            // console.log(this.DbProgram[0]);
            TotalRow = this.DbProgram.length-1;
            LastID = this.DbProgram[TotalRow].AcHCode;
            LastID = ""+(parseInt(LastID.substr(4,4))+1);
            this.PrmModel.AcHDevUser =  'PM'; //this.DbProgram[TotalRow].AcHDevUser;
            this.PrmModel.AcHGroup = this.DbProgram[TotalRow].AcHGroup;
          }
          this.ShowFormSubs = 0;
          this.PrmModel.AcHState = 'N';
          this.PrmModel.AcHUses = 'Y';
          this.PrmModel.AcHCode = 'DV00' + LastID;
          this.PrmModel.AcHSub = 'SETDV00' + LastID;
          this.PrmModel.AcHName = '-';
          // console.log( this.PrmModel );
          this.ShowFormHead = 1;
        }
      });
    }else{
      swal({
        title: 'แจ้งเตือน.!',
        text: "คุณต้องการปรับปรุงข้อมูลโปรแกรมหรือระบบ...หรือไม่!",
        type: 'warning',
        allowOutsideClick: false,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonColor: '#0CC27E',
        cancelButtonColor: '#FF586B',
        confirmButtonText: '<i class="icon icon-check"></i> ใช่, ฉันจะแก้ไข',
        cancelButtonText: '<i class="icon icon-close"></i> ไม่, ยกเลิก',
        confirmButtonClass: 'btn btn-success btn-raised mr-5',
        cancelButtonClass: 'btn btn-danger btn-raised',
        buttonsStyling: true
      }).then(async isConfirm => {
        if( isConfirm.value ){
          this.ShowFormSubs = 0;
          this.PrmModel.AcHState = 'E';
          this.PrmModel.AcHUses = zIndex.AcHUses;
          this.PrmModel.AcHDevUser = 'PM'; // zIndex.AcHDevUser;
          this.PrmModel.AcHGroup = zIndex.AcHGroup;
          this.PrmModel.AcHCode = zIndex.AcHCode;
          this.PrmModel.AcHName = zIndex.AcHName;
          this.PrmModel.AcHSub = zIndex.AcHSub;
          this.ShowFormHead = 1;
        }
      });
    }
  }

  CloseFormSystem(){
    this.ShowFormHead = 0;
    this.ShowFormSubs = 0;
    this.PrmModel.AcHDevUser = '-';
    this.PrmModel.AcHGroup = '-';
    this.PrmModel.AcHCode = '-';
    this.PrmModel.AcHName = '-';
    this.PrmModel.AcHSub = '-';
    this.PrmModel.AcHUses = 'Y';
    this.PrmModel.AcHState = 'N';
  }

  SaveSystemData(){
    // console.log( this.PrmModel );
    if(this.PrmModel.AcHName!='-'&&this.PrmModel.AcHName!=''){
      this.http.post(
        this.appConfig.urlApi + "SaveSystemData.php",
        { dataset:this.PrmModel },{ responseType:"text" }
      ).subscribe(
        async ()=>{
          await this.GetProgramByActCodeUsCode(this.UsCode);
          this.CloseFormSystem();
        }
      )
    }
  }

  FormModuleData( NewState:string, zIndex:any ){
    if(NewState=='N'){
      swal({
        title: 'แจ้งเตือน.!',
        text: "คุณต้องการเพิ่มข้อมูลระบบย่อยหรือโมดูลใหม่...หรือไม่!",
        type: 'question',
        allowOutsideClick: false,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonColor: '#0CC27E',
        cancelButtonColor: '#FF586B',
        confirmButtonText: '<i class="icon icon-check"></i> ใช่, ฉันจะเพิ่ม',
        cancelButtonText: '<i class="icon icon-close"></i> ไม่, ยกเลิก',
        confirmButtonClass: 'btn btn-success btn-raised mr-5',
        cancelButtonClass: 'btn btn-danger btn-raised',
        buttonsStyling: true
      }).then(async isConfirm => {
        if( isConfirm.value ){
          var TotalRow :number;
          var LastID :string;
          console.log( this.MduModel );
          if(this.DbModules.length==0){
            TotalRow = 0;
            LastID = "1001";
            this.MduModel.AcDDevUser ='PM'; //this.UsCode;
            this.MduModel.AcHCode = this.SelectActSubs;
          }else{
            TotalRow = this.DbModules.length-1;
            LastID = this.DbModules[TotalRow].AcDCode;
            LastID = ""+(parseInt(LastID.substr(10,4))+1);
            LastID = this.appConfig.padLeft(LastID,4,'0');
            this.MduModel.AcDDevUser = 'PM'; // this.DbModules[TotalRow].AcDDevUser;
            this.MduModel.AcHCode = this.DbModules[TotalRow].AcHCode;
          }
          this.ShowFormHead = 0;
          this.MduModel.AcDState = 'N';
          this.MduModel.AcDUses = 'Y';
          this.MduModel.AcDCode = this.SelectActSubs + LastID.substr(1,3);
          this.MduModel.AcDName = '-';
          this.ShowFormSubs = 1;
        }
      });
    }else{
      swal({
        title: 'คุณต้องการปรับปรุงข้อมูล',text: "ระบบย่อยหรือโมดูล...หรือไม่ ?",
        type: 'warning',allowOutsideClick: false,
        showConfirmButton: true, showCancelButton: true,
        confirmButtonColor: '#0CC27E', cancelButtonColor: '#FF586B',
        confirmButtonText: '<i class="icon icon-check"></i> ใช่, ฉันจะแก้ไข',
        cancelButtonText: '<i class="icon icon-close"></i> ไม่, ยกเลิก',
        confirmButtonClass: 'btn btn-success btn-raised mr-5',
        cancelButtonClass: 'btn btn-danger btn-raised',
        buttonsStyling: true
      }).then(async isConfirm => {
        if( isConfirm.value ){
          this.ShowFormHead = 0;
          this.MduModel.AcDState = 'E';
          this.MduModel.AcDUses = zIndex.AcDUses;
          this.MduModel.AcDDevUser = 'PM'; // zIndex.AcDDevUser;
          this.MduModel.AcHCode = zIndex.AcHCode;
          this.MduModel.AcDCode = zIndex.AcDCode;
          this.MduModel.AcDName = zIndex.AcDName;
          this.ShowFormSubs = 1;
        }
      });
    }
  }

  CloseFormModule(){
    this.ShowFormHead = 0;
    this.ShowFormSubs = 0;
    this.MduModel.AcDState = 'N';
    this.MduModel.AcDUses = 'Y';
    this.MduModel.AcDDevUser = '-';
    this.MduModel.AcHCode = '-';
    this.MduModel.AcDCode = '-';
    this.MduModel.AcDName = '-';
  }

  SaveModuleData(){
    // console.log( this.MduModel );
    if(this.MduModel.AcDName!='-'&&
       this.MduModel.AcDName!=''){
      this.http.post(
        this.appConfig.urlApi + "SaveModuleData.php",
        { dataset:this.MduModel },{ responseType:"text" }
      ).subscribe(
        (data:any)=>{
          swal({
            title: 'แจ้งเตือน.!',
            text: "ระบบได้บันทึกข้อมูลระบบย่อยหรือโมดูลเสร็จสมบูรณ์แล้ว.",
            type: 'success',
            allowOutsideClick: false,
            showConfirmButton: true,
            showCancelButton: false,
            confirmButtonColor: '#0CC27E',
            cancelButtonColor: '#FF586B',
            confirmButtonText: '<i class="icon icon-check"></i> ตกลง,ปิดฟอร์ม',
            cancelButtonText: '<i class="icon icon-close"></i> ไม่, ยกเลิก',
            confirmButtonClass: 'btn btn-success btn-raised mr-5',
            cancelButtonClass: 'btn btn-danger btn-raised',
            buttonsStyling: true
          }).then( async isConfirm => {
            await this.GetModuleByPrmCode( this.SelectActSubs,
                                          this.SelectProgram,
                                          this.UsCode
                                          );
            this.CloseFormModule();
          });
        }
      )
    }
  }

}
