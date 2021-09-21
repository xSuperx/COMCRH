import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbCalendar, NgbModal, NgbModalConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AppConfig } from 'app/shared/configs/app-config';
import { NgxSpinnerService } from 'ngx-spinner';
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
    // private spinner: NgxSpinnerService
  ){
    config.backdrop = 'static';
    config.keyboard = false;
    setTimeout( () => { this.loadingIndicator = false; }, 1500 );
  }

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
  RowPerPage = 1;

  DbListNotified = [];
  DbListDaily = [];

  ActivitieFrm = new FormGroup ({
    ActCode: new FormControl('-', Validators.required),
    ActDate: new FormControl('-', Validators.required),
    ActUser: new FormControl('-', Validators.required),
    ActUserType: new FormControl('-', Validators.required),
    ActTopic: new FormControl('-', Validators.required),
    ActJobs: new FormControl('-', Validators.required),
    ActBegin: new FormControl('-', Validators.required),
    ActEnd: new FormControl('-', Validators.required),
    ActTotal: new FormControl('-', Validators.required),
  });

  ngOnInit(){
    // this.spinner.show();
    this.SearchDate = this.calendar.getToday();
    this.UsCode = localStorage.getItem( 'LgUserCode' );
    this.UsFName = localStorage.getItem( 'LgUsrFullName' );
    this.UsPosCode = localStorage.getItem( 'LgUsrPosCode' );
    this.ActivitieFrm.patchValue({
      ActUser : this.UsCode,
      ActUserType : this.UsPosCode,
    });
    // setTimeout(()=>{this.spinner.hide();},300);
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
        // this.TimeSumry.TimeSum = 0;
        // this.TimeSumry.TimeActn = 0;
        // this.TimeSumry.TimeIncd = 0;
        // this.TimeSumry.TimeDelp = 0;
        // this.TimeSumry.Timeothr = 0;
        // for(let index = 0; index < this.DbListDaily.length; index++){
        //   var ServTime :number = parseInt(this.DbListDaily[index].SevTimeTotal);
        //   this.TimeSumry.TimeSum = this.TimeSumry.TimeSum + ServTime;
        //   if(this.DbListDaily[index].SevTypeHA=='Activitie'){
        //     this.TimeSumry.TimeActn = this.TimeSumry.TimeActn + ServTime;
        //   }else if(this.DbListDaily[index].SevTypeHA=='Incedent'){
        //     this.TimeSumry.TimeIncd = this.TimeSumry.TimeIncd + ServTime;
        //   }else if(this.DbListDaily[index].SevTypeHA=='Develop'){
        //     this.TimeSumry.TimeDelp = this.TimeSumry.TimeDelp + ServTime;
        //   }else{
        //     this.TimeSumry.Timeothr = this.TimeSumry.Timeothr + ServTime;
        //   }
        // }
        // console.log( this.TimeSumry );
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

}
