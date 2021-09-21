import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'app/shared/configs/app-config';
import { NgbModal, NgbModalConfig, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';

@Component({
  selector: 'app-risk',
  templateUrl: './risk.component.html',
  styleUrls: ['./risk.component.scss']
})
export class RiskComponent implements OnInit {
  loadingIndicator :boolean = true;
  UsCode :string;
  UsFName :string;
  UsPosCode :string;
  UsAdmin :string;

  constructor(
    private http :HttpClient,
    private appConfig :AppConfig,
    private modalService :NgbModal,
    private config :NgbModalConfig,
    private calendar: NgbCalendar
  ){
    config.backdrop = 'static';
    config.keyboard = false;
    setTimeout( () => { this.loadingIndicator = false; }, 1500 );
  }

  RiskModel = {
    RiskID:'-', RiskDate:'-', RiskSource:'-', RiskTopic:'-',
    RiskSolution:'-', RiskCode:'-', RiskName:'-', RiskRemark:'-',
    RiskUser:'-', SevAction:'N', RiskYear:0
  }

  RowPerPage = 10;
  Pages = 1;
  DbYear = [];
  DbRisk = [];
  DbRiskSource = [];
  DbRiskType = [];
  YearSelect = "";

  ngOnInit(){
    this.UsCode = localStorage.getItem( 'LgUserCode' );
    this.UsFName = localStorage.getItem( 'LgUsrFullName' );
    this.UsPosCode = localStorage.getItem( 'LgUsrPosCode' );
    this.DbYear = this.appConfig.Get3Year2();
    this.YearSelect = this.DbYear[1].id;
    this.ListRiskDb(this.YearSelect);
  }

  ShowModal(content){
    this.modalService.open( content, {size:'lg'} );
  }

  OnYearChange(event){
    this.YearSelect = event.id;
    this.ListRiskDb(this.YearSelect);
  }

  OnRiskSourceChange(event){
    this.RiskModel.RiskSource = event.id;
  }

  OnRiskCodeChange(event){
    this.RiskModel.RiskCode = event.id;
    this.RiskModel.RiskName = event.name;
    // console.log( this.RiskModel.RiskCode, this.RiskModel.RiskName );
  }

  ListRiskDb(Year){
    this.http.get(
      this.appConfig.urlApi +
      "ListRiskDb.php" +
      "?yr=" + Year
    ).subscribe(
      async (data:any)=>{
        this.DbRisk = data;
        // console.log( this.DbRisk );
      }
    )
  }

  GetRiskSource(){
    this.http.get(
      this.appConfig.urlApi +
      "RiskGetSource.php"
    ).subscribe(
      async (data:any)=>{
        this.DbRiskSource = data;
        // console.log( this.DbRisk );
      }
    )
  }

  GetRiskType(){
    this.http.get(
      this.appConfig.urlApi +
      "RiskGetType.php"
    ).subscribe(
      async (data:any)=>{
        this.DbRiskType = data;
        // console.log( this.DbRiskType );
      }
    )
  }

  NewRiskEvent(Content){
    swal({
      title: 'ท่านต้องการเพิ่มเหตุการณ์ความเสี่ยงใหม่...หรือไม่ ?',
      text: "", type: 'question', allowOutsideClick: false,
      showConfirmButton: true, showCancelButton: true,
      confirmButtonColor: '#0CC27E', cancelButtonColor: '#FF586B',
      confirmButtonText: '<i class="icon icon-check"></i> ใช่, ฉันต้องการ',
      cancelButtonText: '<i class="icon icon-close"></i> ไม่, ยกเลิก',
      confirmButtonClass: 'btn btn-success btn-raised mr-5',
      cancelButtonClass: 'btn btn-danger btn-raised',
      buttonsStyling: true
    }).then(async isConfirm => {
      if( isConfirm.value ){
        this.GetRiskSource();
        this.GetRiskType();
        this.RiskModel.SevAction = "N";
        this.RiskModel.RiskID =  this.appConfig.getCurDateTime2Db();
        this.RiskModel.RiskDate = this.appConfig.getCurDateNow();
        this.RiskModel.RiskYear  = parseInt(this.YearSelect);
        this.RiskModel.RiskSource = "";
        this.RiskModel.RiskTopic = "";
        this.RiskModel.RiskSolution = "";
        this.RiskModel.RiskCode = "";
        this.RiskModel.RiskName = "";
        this.RiskModel.RiskRemark = "-";
        this.RiskModel.RiskUser = this.UsCode;
        console.log( this.YearSelect, this.RiskModel.RiskYear );
        this.ShowModal(Content);
      }
    });
  }

  UpdateRisk(zRow:any, Content){
    // console.log(zRow);
    var xID = zRow.RiskID;
    swal({
      title: 'ท่านต้องการปรับปรุงข้อมูลความเสี่ยง\nรายการเลขที่ '+xID+'\nหรือไม่ ?',
      text: "", type: 'question', allowOutsideClick: false,
      showConfirmButton: true, showCancelButton: true,
      confirmButtonColor: '#0CC27E', cancelButtonColor: '#FF586B',
      confirmButtonText: '<i class="icon icon-check"></i> ใช่, ฉันต้องการ',
      cancelButtonText: '<i class="icon icon-close"></i> ไม่, ยกเลิก',
      confirmButtonClass: 'btn btn-success btn-raised mr-5',
      cancelButtonClass: 'btn btn-danger btn-raised',
      buttonsStyling: true
    }).then(async isConfirm => {
      if( isConfirm.value ){
        this.GetRiskSource();
        this.GetRiskType();
        this.RiskModel.SevAction = "E";
        this.RiskModel.RiskID = zRow.RiskID;
        var rDate: any = ""+(Number(zRow.RiskDate)-5430000);
        this.RiskModel.RiskDate = this.appConfig.ConvDb2DateYMD(rDate);
        this.RiskModel.RiskYear = parseInt(zRow.RiskYear);
        this.RiskModel.RiskSource = zRow.RiskSource;
        this.RiskModel.RiskTopic = zRow.RiskTopic;
        this.RiskModel.RiskSolution = zRow.RiskSolution;
        this.RiskModel.RiskCode = zRow.RiskCode;
        this.RiskModel.RiskName = zRow.RiskDes;
        this.RiskModel.RiskRemark = zRow.RiskRemark;
        this.RiskModel.RiskUser = this.UsCode;
        console.log( zRow.RiskYear, this.RiskModel.RiskYear );
        // console.log( this.RiskModel );
        this.ShowModal(Content);
      }
    });
  }

  DeleteRisk(zRow:any){
    // console.log(zRow);
    var xID = zRow.RiskID;
    swal({
      title: 'ท่านต้องการลบข้อมูลความเสี่ยง\nรายการเลขที่ '+xID+'\nหรือไม่ ?',
      text: "", type: 'question', allowOutsideClick: false,
      showConfirmButton: true, showCancelButton: true,
      confirmButtonColor: '#0CC27E', cancelButtonColor: '#FF586B',
      confirmButtonText: '<i class="icon icon-check"></i> ใช่, ฉันต้องการ',
      cancelButtonText: '<i class="icon icon-close"></i> ไม่, ยกเลิก',
      confirmButtonClass: 'btn btn-success btn-raised mr-5',
      cancelButtonClass: 'btn btn-danger btn-raised',
      buttonsStyling: true
    }).then(async isConfirm => {
      if( isConfirm.value ){
        setTimeout(()=>{ this.loadingIndicator = true; }, 1000 );
        this.http.post(
          this.appConfig.urlApi +
          "RiskDelete.php",
          { rid: xID, usr: this.UsCode },
          { responseType:"text" }
        ).subscribe(
          async ()=>{
            await this.ListRiskDb(this.YearSelect);
            setTimeout(()=>{ this.loadingIndicator = false; }, 1500 );
            this.CloseForm();
          }
        )
      }
    });
  }

  SaveRisk(){
    console.log(this.RiskModel);
    var ChkFormOK: boolean = true;
    if(this.RiskModel.RiskDate==''){ ChkFormOK = false; }
    if(this.RiskModel.RiskYear==0){ ChkFormOK = false; }
    if(this.RiskModel.RiskSource==''){ ChkFormOK = false; }
    if(this.RiskModel.RiskTopic==''){ ChkFormOK = false; }
    if(this.RiskModel.RiskSolution==''){ ChkFormOK = false; }
    if(this.RiskModel.RiskCode=='-'){ ChkFormOK = false; }
    if(this.RiskModel.RiskRemark==''){ ChkFormOK = false; }
    if(this.RiskModel.RiskUser==''){ ChkFormOK = false; }
    if(ChkFormOK==false){
      swal({
        title: 'โปรดป้อนข้อมูลให้ครบก่อนบันทึก !!',
        text:  'แจ้งเตือน...ฟอร์มบันทึกข้อมูลความเสี่ยง!', type: 'warning',
        allowOutsideClick: false, showConfirmButton: true,
        buttonsStyling: true, confirmButtonColor: '#0CC27E',
        confirmButtonText: '<i class="icon icon-info"></i> ตกลง',
        confirmButtonClass: 'btn btn-success btn-raised mr-5'
      });
    }else{
      setTimeout(()=>{ this.loadingIndicator = true; }, 1000 );
      this.http.post(
        this.appConfig.urlApi +
        "RiskSave.php",
        { prm: this.RiskModel },
        { responseType:"text" }
      ).subscribe(
        async (data:any)=>{
          console.log(data);
          await this.ListRiskDb(this.YearSelect);
          swal({
            title: 'บันทึกปรับปรุงข้อมูลสำเร็จ !!',
            text:  'แจ้งเตือน...ฟอร์มบันทึกข้อมูลความเสี่ยง!', type: 'success',
            allowOutsideClick: false, showConfirmButton: true,
            buttonsStyling: true, confirmButtonColor: '#0CC27E',
            confirmButtonText: '<i class="icon icon-info"></i> ตกลง',
            confirmButtonClass: 'btn btn-success btn-raised mr-5'
          });
          setTimeout(()=>{ this.loadingIndicator = false; }, 1500 );
          this.CloseForm();
        }
      )
    }

  }

  CloseForm(){
    this.RiskModel.SevAction = "N";
    this.RiskModel.RiskID = "";
    this.RiskModel.RiskDate = "";
    this.RiskModel.RiskSource = "";
    this.RiskModel.RiskTopic = "";
    this.RiskModel.RiskSolution = "";
    this.RiskModel.RiskCode = "";
    this.RiskModel.RiskRemark = "";
    this.RiskModel.RiskUser = "";
    this.modalService.dismissAll( 'NotifiedForm' );
  }

  Export_Risk(){
    swal({
      title: 'ท่านต้องการส่งออกข้อมูลแบบ Excel...หรือไม่ ?',
      text: "", type: 'question', allowOutsideClick: false,
      showConfirmButton: true, showCancelButton: true,
      confirmButtonColor: '#0CC27E', cancelButtonColor: '#FF586B',
      confirmButtonText: '<i class="icon icon-check"></i> ใช่, ฉันต้องการ',
      cancelButtonText: '<i class="icon icon-close"></i> ไม่, ยกเลิก',
      confirmButtonClass: 'btn btn-success btn-raised mr-5',
      cancelButtonClass: 'btn btn-danger btn-raised',
      buttonsStyling: true
    }).then(async isConfirm => {
      if( isConfirm.value ){
        this.YearSelect;
      }
    });
  }

}
