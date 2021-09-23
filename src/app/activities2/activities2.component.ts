import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbCalendar, NgbModal, NgbModalConfig, NgbDateStruct, NgbModalRef, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AppConfig } from 'app/shared/configs/app-config';
import swal from 'sweetalert2';
import { value } from '../shared/data/dropdowns';

@Component({
  selector: 'app-activities2',
  templateUrl: './activities2.component.html',
  styleUrls: ['./activities2.component.scss']
})

export class Activities2Component implements OnInit {

  constructor(
    private http :HttpClient,
    private config :NgbModalConfig,
    private calendar: NgbCalendar,
    private appConfig :AppConfig,
    private modalService :NgbModal,
  ){
    config.backdrop = 'static';
    config.keyboard = false;
    setTimeout(()=>{ this.loadingIndicator = false;},1500);
  }

  Mr: NgbModalRef;
  CloseResult: string;
  loadingIndicator :boolean = true;
  reorderable :boolean = true;
  SearchDate :NgbDateStruct;
  UsCode :string;
  UsFName :string;
  UsPosCode :string;
  ActionHUser :string;
  CheckIsHoliday: boolean = false;
  CheckIsHolidayOnForm: boolean = false;
  ActvPages = 1;
  RowPerPage = 10;
  WorkPerDay :number = 0;
  WorkTotal :number = 0;

  DbOptActTopic = [];
  DbListDaily = [];

  DbOptMainTop = [
    { 'id': '01' , 'text': 'กิจกรรมตามตำแหน่งงาน' },
    { 'id': '02' , 'text': 'กิจกรรมที่ได้รับมอบหมาย' },
    { 'id': '03' , 'text': 'กิจกรรมพัฒนาและวิชาการ' },
  ];

  ActivitieFrm = new FormGroup ({
    ActCode: new FormControl('-', Validators.required),
    ActDate: new FormControl('-', Validators.required),
    ActUser: new FormControl('-', Validators.required),
    ActUserName: new FormControl('-', Validators.required),
    ActUserType: new FormControl('-', Validators.required),
    ActJobCode: new FormControl('-', Validators.required),
    ActJobName: new FormControl('-', Validators.required),
    ActNote: new FormControl('-', Validators.required),
    ActBegin: new FormControl('-', Validators.required),
    ActEnd: new FormControl('-', Validators.required),
    ActTotal: new FormControl('-', Validators.required),
    ActState: new FormControl('N', Validators.required),
  });

  async ngOnInit(){
    this.loadingIndicator = true;
    await this.GetDataFromStorage();
    await this.ActivitieFrm.patchValue({
      ActUser : this.UsCode,
      ActUserName: this.UsFName,
      ActUserType : this.UsPosCode,
    });
    // console.log( this.ActivitieFrm.getRawValue() );
    await this.GetOptActTopic(this.UsPosCode);
    await this.GetDailyByDate();
    await setTimeout(()=>{ this.loadingIndicator = false; }, 1500 );
  }

  GetDataFromStorage(){
    this.WorkPerDay = this.appConfig.WorkTimePerDay;
    this.SearchDate = this.calendar.getToday();
    this.UsCode = localStorage.getItem( 'LgUserCode' );
    this.UsFName = localStorage.getItem( 'LgUsrFullName' );
    this.UsPosCode = localStorage.getItem( 'LgUsrPosCode' );
  }

  GetDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ShowContent(content) {
    var option: NgbModalOptions = {
      size: 'lg',
      backdrop: 'static',
      windowClass: 'my-class',
    };
    this.Mr = this.modalService.open(content, option);
    this.Mr.result.then(
      (result) => {
        this.CloseResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.CloseResult = `Dismissed ${this.GetDismissReason(reason)}`;
      }
    );
  }

  CloseModal(){
    this.Mr.dismiss('Close click');
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

  CheckHolidayOnForm(){
    const promise =  new Promise<boolean>((res:any, rej:any)=>{
      var ActDate = this.ActivitieFrm.getRawValue().ActDate;
      var DateDb  = ActDate.substr(0,4) + ActDate.substr(5,2) + ActDate.substr(8,2);
      // 2021-09-23
      console.log( DateDb );
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

  async OnChangeActDate(){
    this.CheckIsHolidayOnForm = await this.CheckHolidayOnForm();
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

  GetOptActTopic(UserType:string){
    this.http.get(
      this.appConfig.urlApi +
      "GetOptActTopic.php" +
      "?ut=" + UserType
    ).subscribe(
      (data:any)=>{
        this.DbOptActTopic = data;
        // console.log( this.DbOptActTopic  );
      }
    )
  }

  OnActJobChange(event:any){
    this.ActivitieFrm.patchValue({
      ActJobName : event.target.options[event.target.options.selectedIndex].text
    });
  }

  GetDailyByDate(){
    var zYear =""+this.SearchDate.year;
        // zYear = zYear.substr(2, 2);
    var DateDb=""+ zYear
                 + this.appConfig.padLeft( this.SearchDate.month, 2, "0")
                 + this.appConfig.padLeft( this.SearchDate.day, 2, "0");
    // console.log( DateDb );
    this.WorkTotal = 0;
    this.http.get(
      this.appConfig.urlApi +
      "getActivitieDailyByDate.php" +
      "?dt=" + DateDb +
      "&us=" + this.UsCode
    ).subscribe(
      async (data:Array<any>) => {
        // console.log( data );
        this.DbListDaily = data;
        for(let i=0; i<this.DbListDaily.length; i++){
          this.WorkTotal = this.WorkTotal + parseFloat(this.DbListDaily[i].ActTotal);
        }
        this.CheckIsHoliday = await this.CheckHoliday();
        this.CheckIsHolidayOnForm = this.CheckIsHoliday;
      }
    )
  }

  NewActivitie( content ){
    const ServCode = this.appConfig.getCurDateTime2Db();
    var DateDb = ""+ this.SearchDate.year +
                 "-"+ this.appConfig.padLeft( this.SearchDate.month, 2, "0") +
                 "-"+ this.appConfig.padLeft( this.SearchDate.day, 2, "0");
    // console.log( DateDb );
    this.ActivitieFrm.reset();
    this.ActivitieFrm.patchValue({
      ActState : 'N',
      ActCode : ServCode,
      ActDate : DateDb,
      ActUser : this.UsCode,
      ActUserName: this.UsFName,
      ActUserType : this.UsPosCode,
      ActJobCode : '',
      ActJobName : '',
      ActNote : '',
      ActBegin : this.appConfig.getCurTimeNow(),
      ActEnd : this.appConfig.getCurTimeNow(),
      ActTotal : '1'
    });
    // console.log( this.ActivitieFrm.getRawValue() );
    this.ShowContent( content );
  }

  EditActivitie( RowDb:any, Content ){
    swal({
      title: 'แจ้งเตือน.!',
      text: "คุณต้องการแก้ไขข้อมูลกิจกรรมหรือไม่.",
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
        this.CheckIsHolidayOnForm = false;
        this.ActivitieFrm.reset();
        this.ActivitieFrm.patchValue({
          ActState : 'E',
          ActCode : RowDb.ActCode,
          ActDate : RowDb.ActDate,
          ActUser : RowDb.ActUser,
          ActUserName: this.UsFName,
          ActUserType : RowDb.ActUserType,
          ActNote : RowDb.ActNote,
          ActJobCode : RowDb.ActJobCode,
          ActJobName : RowDb.ActJobName,
          ActBegin : RowDb.ActBegin,
          ActEnd : RowDb.ActEnd,
          ActTotal : RowDb.ActTotal
        });
        // console.log( this.ActivitieFrm.getRawValue() );
        this.ShowContent( Content );
      }
    });
  }

  CalTimeServ(){
    const tBegin = this.ActivitieFrm.getRawValue().ActBegin;
    const tEnd = this.ActivitieFrm.getRawValue().ActEnd;
    var CalTime :string = "0";
    if( tBegin != null && tEnd != null ){
      CalTime = "" + this.appConfig.GetDiffTime( tBegin, tEnd );
      this.ActivitieFrm.patchValue({ ActTotal : CalTime });
    }else{
      CalTime = "0"
      this.ActivitieFrm.patchValue({ ActTotal : CalTime });
    }
  }

  SaveActivitie(){
    // console.log( this.ActivitieFrm.getRawValue() );
    this.loadingIndicator = true;
    this.http.post(
      this.appConfig.urlApi +
      "SaveDbActivitie2.php",
      { prm: this.ActivitieFrm.getRawValue() },
      { responseType : "text" }
    ).subscribe(
      async ()=>{
        await this.GetDailyByDate();
        await this.ActivitieFrm.reset();
        await setTimeout(()=>{ this.loadingIndicator = false; }, 1500 );
        await this.CloseModal();
      }
    );
  }

  DeleteActivitie( item:any ){
    var ActCode = item.ActCode;
    // console.log( ActCode );
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
          "DeleteActivitie.php",
          { nfc: ActCode },
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

}
