import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbCalendar, NgbModal, NgbModalConfig, NgbDateStruct, NgbModalRef, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AppConfig } from 'app/shared/configs/app-config';
import swal from 'sweetalert2';

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

  DbOptActTopic = [];
  DbListNotified = [];
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
    ActTopic: new FormControl('-', Validators.required),
    ActJobs: new FormControl('-', Validators.required),
    ActBegin: new FormControl('-', Validators.required),
    ActEnd: new FormControl('-', Validators.required),
    ActTotal: new FormControl('-', Validators.required),
    ActState: new FormControl('N', Validators.required),
  });

  async ngOnInit(){
    this.loadingIndicator = true;
      this.SearchDate = this.calendar.getToday();
      this.UsCode = localStorage.getItem( 'LgUserCode' );
      this.UsFName = localStorage.getItem( 'LgUsrFullName' );
      this.UsPosCode = localStorage.getItem( 'LgUsrPosCode' );
      await this.ActivitieFrm.patchValue({
        ActUser : this.UsCode,
        ActUserName: this.UsFName,
        ActUserType : this.UsPosCode,
      });
      // console.log( this.ActivitieFrm.getRawValue() );
      await this.GetOptActTopic(this.UsPosCode);
      await this.GetDailyByDate();
    setTimeout(()=>{ this.loadingIndicator = false; }, 1500 );
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

  GetOptActTopic(UserType:string){
    this.http.get(
      this.appConfig.urlApi +
      "GetOptActTopic.php" +
      "?ut=" + UserType
    ).subscribe(
      (data:any)=>{
        this.DbOptActTopic = data;
        console.log( this.DbOptActTopic  );
      }
    )
  }

  OnActTopicChange(){
    if(this.ActivitieFrm.getRawValue().ActTopic=='กิจกรรมตามตำแหน่งงาน'){
      this.ActivitieFrm.patchValue({ ActJobs: '' });
    }else{
      this.ActivitieFrm.patchValue({ ActJobs: '-' });
    }
    // console.log( this.ActivitieFrm.getRawValue().ActTopic );
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
      }
    )
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
      ActTopic : 'กิจกรรมตามตำแหน่งงาน',
      ActJobs : '',
      ActBegin : this.appConfig.getCurTimeNow(),
      ActEnd : this.appConfig.getCurTimeNow(),
      ActTotal : '1'
    });
    // console.log( this.ActivitieFrm.getRawValue() );
    this.ShowContent( content );
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
    // console.log( tBegin, tEnd, CalTime );
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
        this.ActivitieFrm.reset();
        setTimeout(()=>{ this.loadingIndicator = false; }, 1500 );
        this.CloseModal();
      }
    );
  }

}
