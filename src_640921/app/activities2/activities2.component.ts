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

}
