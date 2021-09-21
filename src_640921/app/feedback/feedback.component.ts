import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalConfig, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AppConfig } from 'app/shared/configs/app-config';
import swal from 'sweetalert2';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})

export class FeedbackComponent implements OnInit {
  UsCode :string;
  UsFName :string;
  UsPosCode :string;
  ActionHUser :string;
  loadingIndicator :boolean = true;
  Mr: NgbModalRef;
  CloseResult: string;

  constructor(
    private http :HttpClient,
    private appConfig :AppConfig,
    private modalService :NgbModal,
    private config :NgbModalConfig
  ){
    config.backdrop = 'static';
    config.keyboard = false;
  }

  RowPerPage = 7;
  NbrPages = 1;
  DbFeedback = [];

  AppOpt = [
    {id:'โปรแกรมคอมพิวเตอร์-HOMC', text:'โปรแกรมคอมพิวเตอร์-HOMC'},
    {id:'โปรแกรมคอมพิวเตอร์-OPD Viewer', text:'โปรแกรมคอมพิวเตอร์-OPD Viewer'},
    {id:'โปรแกรมคอมพิวเตอร์-Docstation', text:'โปรแกรมคอมพิวเตอร์-Docstation'},
    {id:'โปรแกรมคอมพิวเตอร์-IPISS', text:'โปรแกรมคอมพิวเตอร์-IPISS'},
    {id:'โปรแกรมคอมพิวเตอร์-PACS', text:'โปรแกรมคอมพิวเตอร์-PACS'},
    {id:'โปรแกรมคอมพิวเตอร์-LAB', text:'โปรแกรมคอมพิวเตอร์-LAB'},
    {id:'โปรแกรมคอมพิวเตอร์-Thai Refer', text:'โปรแกรมคอมพิวเตอร์-Thai Refer'},
    {id:'โปรแกรมคอมพิวเตอร์-ระบบอื่น ๆ', text:'โปรแกรมคอมพิวเตอร์-ระบบอื่น ๆ'},
    {id:'ครุภัณฑ์คอมพิวเตอร์-เครื่องคอมพิวเตอร์', text:'ครุภัณฑ์คอมพิวเตอร์-เครื่องคอมพิวเตอร์'},
    {id:'ครุภัณฑ์คอมพิวเตอร์-เครื่องพิมพ์', text:'ครุภัณฑ์คอมพิวเตอร์-เครื่องพิมพ์'},
    {id:'ระบบ Wifi', text:'ระบบ Wifi'},
    {id:'ด้านระบบบริการ', text:'ด้านระบบบริการ'},
    {id:'อื่น ๆ', text:'อื่น ๆ'}
  ];

  FeedbackFrm = new FormGroup ({
    FdDatetime: new FormControl(null, Validators.required),
    FdID: new FormControl(null, Validators.required),
    FdApp: new FormControl(null, Validators.required),
    FdText: new FormControl(null, Validators.required),
    FdReturn: new FormControl(null, Validators.required),
    RcDatetime: new FormControl(null, Validators.required),
    RcUser: new FormControl(null, Validators.required),
    RcProc: new FormControl(null, Validators.required),
  });

  ngOnInit(){
    this.UsCode = localStorage.getItem( 'LgUserCode' );
    this.UsFName = localStorage.getItem( 'LgUsrFullName' );
    this.UsPosCode = localStorage.getItem( 'LgUsrPosCode' );
    this.ListFeedback();
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

  GetDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  CloseModals(){
    this.Mr.dismiss('Close click');
  }

  ListFeedback(){
    this.loadingIndicator = true;
    this.http.get(
      this.appConfig.urlApi +
      "ListFeedback.php"
    ).subscribe(
      (data:any)=>{
        this.DbFeedback = data;
        console.log( this.DbFeedback );
        setTimeout(()=>{this.loadingIndicator = false;},500);
      }
    )
  }

  NewFeedback(ModalPanel){
    swal({
      title: "คุณต้องการสร้างข้อเสนอแนะ",
      text: "เพื่อพัฒนาปรับปรุงระบบ หรือไม่!",
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
        this.FeedbackFrm.reset();
        this.FeedbackFrm.patchValue({
          FdDatetime: "-",
          FdID: this.appConfig.getCurDateTime2Db(),
          FdApp: null,
          FdText: null,
          FdReturn: null,
          RcDatetime: "-",
          RcUser: "-",
          RcProc: "-",
        });
        this.ShowContent(ModalPanel);
      }
    });
  }

  SaveFeedback(){
    this.loadingIndicator = true;
    this.http.post(
      this.appConfig.urlApi +
      "SaveFeedback.php",
      { frm: this.FeedbackFrm.getRawValue() }
    ).subscribe(
      (data:any)=>{
        this.ListFeedback();
        this.CloseModals();
      }
    )
  }

}
