import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AppConfig } from 'app/shared/configs/app-config';
import swal from 'sweetalert2';

@Component({
  selector: 'app-do-service',
  templateUrl: './do-service.component.html',
  styleUrls: ['./do-service.component.scss']
})

export class DoServiceComponent implements OnInit {

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
  ServPages = 1;
  RowPerPage = 10;
  WorkPerDay :number = 0;
  WorkTotal :number = 0;

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

  DbOptService = [];
  DbServDaily = [];

  ServiceFrm = new FormGroup ({
    SevCode: new FormControl('-', Validators.required),
    DeptCode: new FormControl('-', Validators.required),
    DeptName: new FormControl('-', Validators.required),
    DeptPhone: new FormControl('-', Validators.required),
    DeptUser: new FormControl('-', Validators.required),
    DeptPlace: new FormControl('-', Validators.required),
    DeptProblem: new FormControl('-', Validators.required),
    ServItems: new FormControl('-', Validators.required),
    ServProblem: new FormControl('-', Validators.required),
    ServCause: new FormControl('-', Validators.required),
    ServRisk: new FormControl('-', Validators.required),
    ServTotal: new FormControl('-', Validators.required),
    TimeNotify: new FormControl('-', Validators.required),
    TimeBegin: new FormControl('-', Validators.required),
    TimeEnd: new FormControl('-', Validators.required),
    TimeTotal: new FormControl('-', Validators.required),
    ServDate: new FormControl('-', Validators.required),
    ServUser: new FormControl('-', Validators.required),
  });

  async ngOnInit(){
    this.loadingIndicator = true;
    await this.GetDataFromStorage();

    await setTimeout(()=>{ this.loadingIndicator = false; }, 1000 );
  }

  GetDataFromStorage(){
    this.WorkTotal = 0;
    this.WorkPerDay = this.appConfig.WorkTimePerDay;
    // console.log( this.WorkPerDay, this.WorkTotal );
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

  GetOptServiceByUserType(UserType:string){
    this.http.get(
      this.appConfig.urlApi +
      "GetOptServiceByUserType.php" +
      "?ut=" + UserType
    ).subscribe(
      (data:any)=>{
        this.DbOptService = data;
        // console.log( this.DbOptService  );
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
      "GetDoServiceByDate.php" +
      "?ds=" + DateDb
    ).subscribe(
      async (data:any)=>{
        this.DbServDaily = data;
        // console.log( this.DbServDaily );
      }
    )
  }

  NewService(Content){
    this.ShowContent(Content);
  }

  EditService(RowDb:any, Content){
    console.log(RowDb);
  }

  DeleteService(RowDb:any){
    console.log(RowDb);
  }

}
