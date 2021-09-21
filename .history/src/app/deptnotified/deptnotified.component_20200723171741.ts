import { Component, OnInit } from '@angular/core';
import {
  NgbModal,
  NgbModalConfig,
  NgbCalendar,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'app/shared/configs/app-config';
import swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-deptnotified',
  templateUrl: './deptnotified.component.html',
  styleUrls: ['./deptnotified.component.scss'],
})
export class DeptnotifiedComponent implements OnInit {
  loadingIndicator: boolean = true;
  SearchDate: NgbDateStruct;
  RowPerPage = 7;
  NotiPages = 1;
  DeptSelect: any = null;

  DbListNotified = [];
  DbDeptINV = [];

  NtfModel = {
    NotfCode: null,
    DeptUsCode: null,
    DeptUsPass: null,
    DeptUsFName: '-',
    DeptUsPosi: '-',
    DeptCode: null,
    DeptName: '-',
    DeptPhone: '-',
    DeptProblem: '-',
    DeptProblemPoint: '-',
    FormValidate: '-',
    FormError: '-',
  };

  constructor(
    private http: HttpClient,
    private Config: AppConfig,
    private modalService: NgbModal,
    config: NgbModalConfig,
    private calendar: NgbCalendar
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    setTimeout(() => {
      this.loadingIndicator = false;
    }, 1500);
  }

  ngOnInit() {
    this.SearchDate = this.calendar.getToday();
    this.GetDeptInv();

    this.GetDbNotifiedByDate();

    setInterval(() => {
      console.log(
        'GetDbNotifiedByDate as ',
        moment().format('DD-MM-YYYY H:m:s')
      );
      this.GetDbNotifiedByDate();
    }, 1000);
    // 60000 * 10
  }

  NewNotified(content) {
    const ServCode = this.Config.getCurDateTime2Db();
    this.ClearValueNtfModel();
    this.NtfModel.NotfCode = ServCode;
    this.ShowModal(content);
  }

  GetDeptInv() {
    this.http
      .get(this.Config.urlApi + 'getDeptINV.php')
      .subscribe((data: any) => {
        this.DbDeptINV = data;
        // console.log( this.DbDeptINV );
      });
  }

  ShowModal(content) {
    this.modalService.open(content, { size: 'lg' });
  }

  ClearValueNtfModel() {
    this.NtfModel.NotfCode = null;
    this.NtfModel.DeptUsCode = null;
    this.NtfModel.DeptUsPass = null;
    this.NtfModel.DeptUsFName = '-';
    this.NtfModel.DeptUsPosi = '-';
    this.NtfModel.DeptCode = null;
    this.NtfModel.DeptName = '-';
    this.NtfModel.DeptPhone = '-';
    this.NtfModel.DeptProblem = '-';
    this.NtfModel.DeptProblemPoint = '-';
    this.NtfModel.FormValidate = '-';
    this.NtfModel.FormError = '-';
    this.DeptSelect = null;
  }

  UpdateNotified(zIndex, content) {}

  GetDbNotifiedByDate() {
    var zYear = '' + this.SearchDate.year;
    zYear = zYear.substr(2, 2);
    var DateDb =
      '' +
      zYear +
      this.Config.padLeft(this.SearchDate.month, 2, '0') +
      this.Config.padLeft(this.SearchDate.day, 2, '0');
    // console.log( DateDb );
    this.http
      .get(this.Config.urlApi + 'getDbNotifiedByDate.php' + '?dt=' + DateDb)
      .subscribe((data: any) => {
        this.DbListNotified = data;
        // console.log( this.DbListNotified );
      });
  }

  DeleteNotified(zIndex) {
    var NotifCode = this.DbListNotified[zIndex].SevCode;
    swal({
      title: 'แจ้งเตือน.!',
      text: 'คุณต้องการลบรายการนี้ จากรายการรับแจ้งปัญหาใช่หรือไม่!',
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
      buttonsStyling: true,
    }).then(async (isConfirm) => {
      if (isConfirm.value) {
        await this.http
          .post(
            this.Config.urlApi + 'DeleteNotified.php',
            { nfc: NotifCode },
            { responseType: 'text' }
          )
          .subscribe(async () => {
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
              confirmButtonClass: 'btn btn-success btn-raised mr-5',
            });
          });
      }
    });
  }

  getFormValidate(ElementChk: string) {
    this.NtfModel.FormValidate = '-';
    this.NtfModel.FormError = '-';
    if (ElementChk == 'DeptUsCode' && this.NtfModel.DeptUsCode == null) {
      this.NtfModel.FormValidate = 'DeptUsCode';
      this.NtfModel.FormError = 'โปรดระบุรหัสผู้ใช้งาน..!!';
    }
    if (ElementChk == 'DeptUsPass' && this.NtfModel.DeptUsPass == null) {
      this.NtfModel.FormValidate = 'DeptUsPass';
      this.NtfModel.FormError = 'โปรดระบุรหัสผ่าน..!!';
    }
    if (ElementChk == 'DeptCode' && this.NtfModel.DeptCode == null) {
      this.NtfModel.FormValidate = 'DeptCode';
      this.NtfModel.FormError = 'โปรดระบุหน่วยงาน..!!';
    }
    if (ElementChk == 'DeptPhone' && this.NtfModel.DeptPhone == null) {
      this.NtfModel.FormValidate = 'DeptPhone';
      this.NtfModel.FormError = 'โปรดระบุเบอร์ภายใน..!!';
    }
    if (ElementChk == 'DeptProblem' && this.NtfModel.DeptProblem == null) {
      this.NtfModel.FormValidate = 'DeptProblem';
      this.NtfModel.FormError = 'โปรดระบุปัญหาที่พบ..!!';
    }
    if (
      ElementChk == 'DeptProblemPoint' &&
      this.NtfModel.DeptProblemPoint == null
    ) {
      this.NtfModel.FormValidate = 'DeptProblemPoint';
      this.NtfModel.FormError = 'โปรดระบุจุดหรือบริเวณที่พบปัญหา..!!';
    }
  }

  GetUserLogin() {
    // console.log( this.NtfModel.FormValidate,this.NtfModel.FormError );
    // console.log( this.NtfModel.DeptUsCode,this.NtfModel.DeptUsPass );
    if (this.NtfModel.FormValidate == '-' && this.NtfModel.FormError == '-') {
      this.http
        .post(this.Config.urlApi + 'getUser.php', {
          username: this.NtfModel.DeptUsCode,
          password: this.NtfModel.DeptUsPass,
        })
        .subscribe((data: any) => {
          // console.log( data );
          // console.log( data.length );
          if (data.length > 0) {
            this.NtfModel.DeptUsCode = data[0].username;
            this.NtfModel.DeptUsFName = data[0].fullname;
            this.NtfModel.DeptUsPosi = data[0].posiname;
            this.NtfModel.DeptCode = data[0].deptcode;
            this.NtfModel.DeptName = data[0].deptname;
            if (data[0].deptphone == '-') {
              this.NtfModel.DeptPhone = null;
            } else {
              this.NtfModel.DeptPhone = data[0].deptphone;
            }
            this.NtfModel.DeptProblem = null;
            this.NtfModel.DeptProblemPoint = null;
            // this.DeptSelect = data[0].deptcode;
            // this.DeptSelect = this.DbDeptINV[0].id;
            // console.log( this.NtfModel );
          }
        });
    }
  }

  SaveNotified() {
    if (
      this.NtfModel.DeptProblem != null &&
      this.NtfModel.DeptProblemPoint != null &&
      this.NtfModel.DeptPhone != null
    ) {
      this.http
        .post(this.Config.urlApi + 'savedeptnotified.php', {
          dbase: this.NtfModel,
        })
        .subscribe((data: any) => {
          // console.log( data );
          this.GetDbNotifiedByDate();
        });
    }
  }
}
