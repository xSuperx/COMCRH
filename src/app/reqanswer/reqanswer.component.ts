import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalConfig, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AppConfig } from 'app/shared/configs/app-config';
import { FileUploader } from 'ng2-file-upload';
import Swal from 'sweetalert2';
const url :any = 'http://172.16.1.32:80/ComAPI/UploadDocsAppRequest.php';

@Component({
  selector: 'app-reqanswer',
  templateUrl: './reqanswer.component.html',
  styleUrls: ['./reqanswer.component.scss']
})

export class ReqanswerComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({url:url});
  loadingIndicator :boolean = true;

  constructor(
    private http :HttpClient,
    private appConfig :AppConfig,
    private modalService :NgbModal,
    Config :NgbModalConfig
  ){
    Config.backdrop = 'static';
    Config.keyboard = false;
    setTimeout(()=>{ this.loadingIndicator=false;},1500);
  }

  Mr: NgbModalRef;        CloseResult: string;
  UsCode :string;         UsFName :string;
  UsPosCode :string;      ActionHUser :string;

  DbRegApp = [];        DbProgramer = [];
  YearReg = "";         YearList = [];        DbReporter = [];
  SearchTxt1 = "";  T1RowPerPage = 10;  T1PageNbr = 1;  DbFeedback = [];
  SearchTxt2 = "";  T2RowPerPage = 10;  T2PageNbr = 1;  DbReqCom = [];
  SearchTxt3 = "";  T3RowPerPage = 10;  T3PageNbr = 1;  DbReqApp = [];
  SearchTxt4 = "";  T4RowPerPage = 10;  T4PageNbr = 1;  DbReqRep = [];

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

  RequestFrm = new FormGroup ({
    ReqNbr: new FormControl( null, { validators: Validators.required } ),
    ReqType: new FormControl( null, { validators: Validators.required } ),
    ReqTitle: new FormControl( null, { validators: Validators.required } ),
    ReqUser: new FormControl( null, { validators: Validators.required } ),
    ReqReason: new FormControl( null, { validators: Validators.required } ),
    ReqReturn: new FormControl( null, { validators: Validators.required } ),
    ReqRisks: new FormControl( null, { validators: Validators.required } ),
    ReqResource: new FormControl( null, { validators: Validators.required } ),
    ReqForRM: new FormControl( null, { validators: Validators.required } ),
    ReqForRMTxt: new FormControl( null, { validators: Validators.required } ),
    ReqRequestor: new FormControl( null, { validators: Validators.required } ),
    ReqProgrammer: new FormControl( null, { validators: Validators.required } ),
    ReqImportance: new FormControl( null, { validators: Validators.required } ),
    ReqCreateTime: new FormControl( null, { validators: Validators.required } ),
    ReqUsrContact: new FormControl( null, { validators: Validators.required } ),
    ReqUsrContactTel: new FormControl( null, { validators: Validators.required } ),
    ReqAprDate: new FormControl( null, { validators: Validators.required } ),
    ReqAprRes: new FormControl( null, { validators: Validators.required } ),
    ReqAprRemark: new FormControl( null, { validators: Validators.required } ),
    ReqAprTOR: new FormControl( null, { validators: Validators.required } ),
    ReqAppConOrther: new FormControl( null, { validators: Validators.required } ),
    ReqPartUI: new FormControl( null, { validators: Validators.required } ),
    ReqPartRep: new FormControl( null, { validators: Validators.required } ),
    ChkDupState: new FormControl( null, { validators: Validators.required } ),
    ChkDupNote: new FormControl( null, { validators: Validators.required } ),
    ChkUsrReceipter: new FormControl( null, { validators: Validators.required } ),
    ChkUsrInstaller: new FormControl( null, { validators: Validators.required } ),
    AppCodeCreate: new FormControl( null, { validators: Validators.required } ),
  });

  RoadMapDb = [
    { id:'R01', text:'R01: อัตราการเสียชีวิตผู้ป่วยโรคหัวใจ < 8%'},
    { id:'R02', text:'R02: อัตราการเสียชีวิตผู้ป่วยโรคหลอดเลือดสมอง (I60-I69) น้อยกว่าหรือเท่ากับ 7%'},
    { id:'R03', text:'R03: อัตราตายของผู้ป่วยอุบัติเหตุน้อยกว่า 16 ต่อแสนประชากร'},
    { id:'R04', text:'R04: อัตราการเสียชีวิตในโรคที่สำคัญทางอายุรกรรมลดลง'},
    { id:'R05', text:'R05: อัตราการเสียชีวิตในโรคสำคัญทางศัลยกรรม UGIH, CA breast ลดลง 3%'},
    { id:'R06', text:'R06: อัตราการเสียชีวิตในโรคที่สำคัญทางศัลยกรรมออร์โธปิดิกส์ ลดลง 10 %'},
    { id:'R07', text:'R07: อัตราตายของมารดา < 15 : 100,000'},
    { id:'R08', text:'R08: อัตราการเสียชีวิตของผู้ป่วยเด็ก <1%'},
    { id:'R09', text:'R09: ระดับความสำเร็จการพัฒนาคุณภาพงานบริการผู้ป่วยจักษุ'},
    { id:'R10', text:'R10: ระดับความสำเร็จการพัฒนาคุณภาพงานบริการผู้ป่วยโสต ศอ นาสิก'},
    { id:'R11', text:'R11: อัตราการรอดชีวิตของผู้ป่วยโรคมะเร็ง เพิ่มขึ้น 3%'},
    { id:'R12', text:'R12: ระดับความสำเร็จในการบรรลุผลสัมฤทธิ์การพัฒนาระบบการรับบริจาคและปลูกถ่ายอวัยวะ'},
    { id:'R13', text:'R13: จิตเวช'},
    { id:'R14', text:'R14: ระดับความสำเร็จในการบรรลุผลสัมฤทธ์ การพัฒนา ระบบการดูแล ในกลุ่มโรคในช่องปาก'},
    { id:'R15', text:'R15: อัตราข้อผิดพลาดในระบบงานที่สำคัญลดลง 10%'},
    { id:'R16', text:'R16: อัตราการสร้างเสริมสุขภาพตามกลุ่มวัยไม่น้อยกว่า ร้อยละ 80'},
    { id:'R17', text:'R17: อัตราความสำเร็จของโครงการป้องกัน ควบคุมโรคที่สามารถป้องกันได้ร้อยละ 70'},
    { id:'R18', text:'R18: อัตราผลสำเร็จการดำเนินงานพัฒนาระบบบริการปฐมภูมิ ร้อยละ 80'},
    { id:'R19', text:'R19: อัตราการคงอยู่ในระบบของบัณฑิตแพทย์ ที่ผลิตโครงการ CPIRD 3ปี ODOD 12 ปี > 80%'},
    { id:'R20', text:'R20: ศูนย์สหวิชาชีพศาสตร์ศึกษา'},
    { id:'R21', text:'R21: การตีพิมพ์เผยแพร่ระดับชาติ / นานาชาติ'},
    { id:'R22', text:'R22: Premium'},
    { id:'R23', text:'R23: ระดับความสำเร็จของผู้ป่วยในระบบบริการได้รับบริการทางสุขภาพแบบองค์รวม'},
    { id:'R24', text:'R24: อัตราการบรรลุผลสัมฤทธิ์ของโครงการความร่วมมือในการจัดการสุขภาพกับภาคีเครือข่าย'},
    { id:'R25', text:'R25: อุบัติการณ์ความผิดพลาดในระบบสนับสนุน=0'},
    { id:'R26', text:'R26: Financial  Management'},
    { id:'R27', text:'R27: อัตราการลาออกจากงานของบุคลากร Turnover rate น้อยกว่า 3 %'},
    { id:'R28', text:'R28: ระดับความสำเร็จในการบรรลุผลสัมฤทธิ์ ปี 2561 การเป็นศูนย์การแพทย์ชั้นเลิศในดวงใจแห่งอนุภูมิภาคลุ่มน้ำโขง'},
    { id:'R29', text:'R29: อัตราการใช้สารสนเทศเพื่อการบริหารจัดการระบบบริการ มากกว่าหรือเท่ากับร้อยละ 60'},
    { id:'R30', text:'R30: ตัวชี้วัดกลาง/PAกระทรวง/นโยบายโรงพยาบาล/งานท้าทาย'},
  ];

  OptDupState = [
    { id:'-', text:'รอตรวจ'},
    { id:'Y', text:'ซ้ำซ้อน'},
    { id:'N', text:'ไม่ซ้ำ'},
  ];

  OptApproveState = [
    { id:'-', text:'รอพิจารณา'},
    { id:'Y', text:'อนมุัติ'},
    { id:'N', text:'ไม่อนุมัติ'},
    { id:'L', text:'ศึกษาเพิ่มเติม'},
  ];

  ngOnInit(){
    this.UsCode = localStorage.getItem( 'LgUserCode' );
    this.UsFName = localStorage.getItem( 'LgUsrFullName' )+'('+this.UsCode+')';
    this.UsPosCode = localStorage.getItem( 'LgUsrPosCode' );
    this.YearList = this.appConfig.Get3Year2();
    this.YearReg = this.YearList[1].id;
    // console.log( this.YearList[1].id );
    this.SarchFeedBack();
    this.SarchReqCom();
    this.SarchReqApp();
    this.GetProgrammer();
    this.SarchReqReport();
    this.GetReporter();
  }

  ShowContent( content ){
    var option: NgbModalOptions = {
      size:'lg',
      backdrop:'static',
      windowClass:'my-class'
    };
    this.Mr = this.modalService.open(content, option);
    this.Mr.result.then(
      result => {
        this.CloseResult = `Closed with: ${result}`;
      },
      reason => {
        this.CloseResult = `Dismissed ${this.GetDismissReason(reason)}`;
      }
    );
  }

  GetDismissReason( reason:any ): string {
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

  GetRequestReport(){
    this.http.get(
      this.appConfig.urlApi
        +'ListRequestReport.php'
    ).subscribe(
      (data:any) => {
        this.DbReqRep = data;
        // console.log( this.DbReqRep );
      }
    );
  }

  GetProgrammer(){
    this.http.get(
      this.appConfig.urlApi
        +'GetProgrammer.php'
    ).subscribe(
      (data:any) => {
        this.DbProgramer = data;
        // console.log( this.DbProgramer );
      }
    );
  }

  GetReporter(){
    this.http.get(
      this.appConfig.urlApi
        +'GetReporter.php'
    ).subscribe(
      (data:any) => {
        this.DbReporter = data;
        // console.log( this.DbReporter );
      }
    );
  }

  NewRepDialog(Content){
    Swal({
      title: "ท่านต้องการลงทะเบียนขอสนับสนุน"+
             "\nจัดทำรายงานสถิติ...หรือไม่ ?",
      text: "", type:'question', allowOutsideClick: false,
      showConfirmButton: true, showCancelButton: true,
      confirmButtonColor: '#0CC27E', cancelButtonColor: '#FF586B',
      confirmButtonText: '<i class="icon icon-check"></i> ใช่-ฉันต้องการ',
      cancelButtonText: '<i class="icon icon-close"></i> ไม่-ยกเลิก',
      confirmButtonClass: 'btn btn-success btn-raised mr-5',
      cancelButtonClass: 'btn btn-danger btn-raised',
      buttonsStyling: true
    }).then(
      async isConfirm => {
        if(isConfirm.value){
          var CruYMD = this.appConfig.getCurDateTime2Db();
          this.RequestFrm.reset();
          this.RequestFrm.patchValue({
            ReqNbr: CruYMD,
            ReqType: "R",
            ReqUser: null,
            ReqRequestor: null,
            ReqUsrContact: null,
            ReqUsrContactTel: null,
            ReqTitle: null,
            ReqReason: null,
            ReqReturn: null,
            ReqResource: null,
            ReqRisks: "-",
            ReqAppConOrther: "-",
            ReqForRM: null,
            ReqPartUI: null
          });
          this.ShowContent(Content);
        }
      }
    );
  }

  onFileSelected( Element: any ){
    this.uploader.clearQueue();
    this.uploader.addToQueue(Element);
    if(Element.length>0){
      if(Element[0].type=='application/pdf'){
        // console.log( Element );
        // console.log( Element[0].name );
        // console.log( Element[0].type );
        this.RequestFrm.patchValue({ ReqPartUI: Element[0].name });
        // console.log( this.RequestFrm.get( 'ReqPartUI' ).value );
      }else{
        Swal({
          title: 'ท่านสามารถอัพโหลดไฟล์\nในรูปแบบ PDF เท่านั้น..!!',
          text: '', type: 'warning', allowOutsideClick: false,
          showConfirmButton: true, buttonsStyling: true,
          confirmButtonColor: '#0CC27E',
          confirmButtonText: '<i class="fa fa-check"></i> ตกลง',
          confirmButtonClass: 'btn btn-success btn-raised',
        });
        this.RequestFrm.patchValue({ ReqPartUI: null });
      }
    }else{
      this.RequestFrm.patchValue({ ReqPartUI: null });
    }
  }

  SaveNewReport(){
    // console.log( this.RequestFrm.getRawValue );
    if(this.uploader.queue.length > 0){
      var zRprReqNbr = this.RequestFrm.get( 'ReqNbr' ).value;
      this.uploader.onBuildItemForm = ( fileItem:any, form:any )=>{
        form.append('ReqNbr', zRprReqNbr);
        return{ fileItem, form };
      };
      this.uploader.queue[0].withCredentials = false;
      this.uploader.uploadItem(this.uploader.queue[0]);
      this.uploader.onCompleteItem = (item, response, status) => {
        if(status === 200){
          let data = JSON.parse(response);
          if(data.State === true){
            this.RequestFrm.patchValue({ ReqPartUI: data.FileName });
            // console.log( this.RequestFrm );
            this.http.post(
              this.appConfig.urlApi + 'SaveNewReport.php',
              { dbase: this.RequestFrm.value }
            ).subscribe(
              (data:any)=>{
                // console.log( data );
                this.GetRequestReport();
                Swal({
                  title: 'บันทึกคำขอจัดสร้างระบบใหม่ \n เสร็จสมบูรณ์ ?',
                  text: '', type: 'success', allowOutsideClick: false,
                  showConfirmButton: true, buttonsStyling: true,
                  confirmButtonColor: '#0CC27E',
                  confirmButtonText: '<i class="icon icon-star"></i> ตกลง',
                  confirmButtonClass: 'btn btn-success btn-raised mr-5',
                });
                this.RequestFrm.reset();
                this.CloseModals();
              }
            );
          }else{
            this.RequestFrm.patchValue({ ReqPartUI: null });
          }
        }
      }
    }
  }

  XlsExport_ReqWaitCsi(){
  //   Swal.fire({
  //     title: 'คุณต้องการส่งออกประวัติการแจ้งซ่อมของหน่วยเบิก',
  //     text: "ใช่หรือไม่!", icon: 'warning',
  //     allowOutsideClick: false, showConfirmButton: true,
  //     showCancelButton: true, buttonsStyling: true,
  //     confirmButtonColor: '#0CC27E', cancelButtonColor: '#FF586B',
  //     confirmButtonText: '<i class="icon icon-check"></i> ใช่, ฉันแน่ใจ',
  //     cancelButtonText: '<i class="icon icon-close"></i> ไม่, ยกเลิก'
  //   }).then((result)=>{
  //     if(result.value){
  //       const WS: XLSX.WorkSheet = XLSX.utils.json_to_sheet( this.DbProductRepair );
  //       var hd = [
  //         "เลขครุภัณฑ์","ชื่อครุภัณฑ์","ยี่ห้อ","รุ่น","ปีงบประมาณ","เลขทีคำขอ",
  //         "วันที่ร้องขอ","อาการเสีย","รหัสหน่วยเบิก","ชื่อหน่วยเบิก","สถานะที่ติดตั้ง",
  //         "สาเหตุความจำเป็นต้องซ่อม","จำนวน","รหัสหน่วยซ่อมบำรุง","ชื่อหน่วยซ่อมบำรุง",
  //         "คณะกรรมการตรวจรับ_1","คณะกรรมการตรวจรับ_2","คณะกรรมการตรวจรับ_3",
  //         "รหัสผู้บันทึกคำรอง","พิจารณาประเภทจ้างเหมา","พิจารณาวันที่","รหัสผลการพิจารณา",
  //         "ผลการพิจารณา","รหัสคณะกรรมพิจารณา","ชื่อคณะกรรมพิจารณา","วันที่บันทึกผลการพิจารณา",
  //         "เลข-OD","รหัสรูปแบบดำเนินการ","รูปแบบดำเนินการ","วงเงินจัดสรร","รหัสแหล่งงบ",
  //         "ชื่อแหล่งงบประมาณ","รหัสผู้บันทึกผล","วันเวลาบันทึกล่าสุด","เลขที่-EPOC",
  //         "เลขที่-EGP","เลขที่โครงการ","รหัสการจัดหา","การจัดหา","วันที่รับทราบงาน",
  //         "วันที่เริ่มดำเนินการซ่อมบำรุง","วันที่ดำเนินการเสร็จสิ้น","ผลการดำเนินการ",
  //         "วันที่ตรวจรับและส่งงาน","ชื่อผู้รับสินค้า,วัสดุ,ชิ้นงาน","รหัสผู้ดำเนินการ", "ชื่อผู้ดำเนินการ",
  //         "วันที่เข้ารับทราบงาน","สถานที่ดำเนินการ","วันที่เริ่มสัญญา","วันที่สิ้นสุดสัญญา",
  //         "จำนวนงวดงาน","จำนวนงวดเงิน","วงเงินจ้างเหมา","จำนวนวันรับประกัน(วัน)",
  //         "ระยะเวลาการส่งมอบ(วัน)","แจ้งเตือนครบกำหนดสัญญา(วัน)","ชื่อผู้ควบคุมงาน",
  //         "วันที่ตรวจรับและส่งงาน","ชื่อผู้รับสินค้า,วัสดุ,ชิ้นงาน","หมายเหตุ/บันทึกเพิ่มเติม",
  //         "เลข-OD"
  //       ];
  //       for(var C = 0; C <= 62; ++C) {
  //         var address = XLSX.utils.encode_col(C) + "1";
  //         if(hd[C]){
  //           WS[address].v = hd[C];
  //           WS[address].s = {
  //                             border: {
  //                               top: {style: "thin", color: {auto: 1}},
  //                               right: {style: "thin", color: {auto: 1}},
  //                               bottom: {style: "thin", color: {auto: 1}},
  //                               left: {style: "thin", color: {auto: 1}}
  //                             }
  //                           };
  //         }
  //       }
  //       const WB: XLSX.WorkBook = XLSX.utils.book_new();
  //       XLSX.utils.book_append_sheet( WB, WS, 'DbReqHistory' );
  //       XLSX.writeFile( WB, 'ประวัติการซ่อมบำรุง.xlsx' );
  //     }
  //   });
  }

  SarchFeedBack(){
    // console.log( this.SearchTxt1 );
    this.http.post(
      this.appConfig.urlApi + 'SarchFeedBack.php',
      { stxt: this.SearchTxt1, year: this.YearReg }
    ).subscribe(
      (data:any) => {
        this.DbFeedback = data;
        // console.log( this.DbFeedback );
      }
    );
  }

  FeedbackAccept(RowDB:any, content){
    // console.log( RowDB );
    this.FeedbackFrm.patchValue({
      FdID: RowDB.FdID,
      FdApp: RowDB.FdApp,
      FdText: RowDB.FdText,
      FdDatetime: RowDB.FdDatetime,
      FdReturn: RowDB.FdReturn,
      RcProc: null,
      RcUser: this.UsFName,
      RcDatetime: this.appConfig.getCurDateTimeNow(),
    });
    // console.log( this.FeedbackFrm.getRawValue() );
    this.ShowContent(content);
  }

  SaveAcceptFeedback(){
    // console.log( this.FeedbackFrm.getRawValue() );
    this.http.post(
      this.appConfig.urlApi + 'UpdateFeedback.php',
      { frm: this.FeedbackFrm.getRawValue() }
    ).subscribe(
      (data:any)=>{
        // console.log( data );
        this.SarchFeedBack();
        Swal({
          title: 'บันทึกการตอบรับคำแนะนำ \n เสร็จสมบูรณ์ ?',
          text: '', type: 'success', allowOutsideClick: false,
          showConfirmButton: true, buttonsStyling: true,
          confirmButtonColor: '#0CC27E',
          confirmButtonText: '<i class="icon icon-star"></i> ตกลง',
          confirmButtonClass: 'btn btn-success btn-raised mr-5',
        });
        this.FeedbackFrm.reset();
        this.CloseModals();
      }
    );
  }

  SarchReqCom(){
    // console.log( this.SearchTxt2 );
    this.http.post(
      this.appConfig.urlApi + 'SearchRequestByType.php',
      { stype:'C', year: this.YearReg, stxt: this.SearchTxt2 }
    ).subscribe(
      (data:any) => {
        this.DbReqCom = data;
        // console.log( this.DbReqCom );
      }
    );
  }

  ReqComAccept(RowDB:any, content){
    // console.log( RowDB );
    this.RequestFrm.patchValue({
      ReqType : RowDB.ReqType ,                     // ประเภทการ้องขอ
      ReqNbr : RowDB.ReqNbr ,                       // รหัสคำขอ
      ReqTitle : RowDB.ReqTitle ,                   // ชื่อระบบที่ขอ(ชื่อระบบที่ขอพัฒนา)
      ReqUser : RowDB.ReqUser ,                     // ชื่อผู้ร้องขอ
      ReqReason : RowDB.ReqReason ,                 // เหตุผลความต้องการ
      ReqReturn : RowDB.ReqReturn ,                 // ผลลัพธ์ที่คาดว่าจะได้
      ReqResource : RowDB.ReqResource ,             // ทรัพยากรที่ต้องการใช้เพิ่มเติม
      ReqUsrContact : RowDB.ReqUsrContact ,         // ชื่อผู้ประสานงานในขั้นตอนพัฒนาระบบ
      ReqUsrContactTel : RowDB.ReqUsrContactTel ,   // เบอร์โทรภายในสำหรับงาน

      ChkDupState : RowDB.ChkDupState  ,            // สถานะตรวจสอบคำร้อง [-=รอตรวจ/Y=ซ้ำซ้อน/N=ไม่ซ้ำ]
      ChkDupNote : RowDB.ChkDupNote  ,              // รายละเอียดความซ้ำซ้อนจากการตรวจสอบ
      ChkUsrReceipter : this.UsFName,               // ชื่อผู้ตรวจรับคำร้อง
      ReqAprRes : '-' ,                             // ผลการพิจารณา [-รอพิจารณา/Y=อนุมัติ/N=ไม่อนุมัติ/L=ศึกษาเพิ่มเติม]
      ReqAprRemark : null,                          // เหตุผลประกอบผลพิจารณา
      ReqAprDate : RowDB.ReqAprDate,                 // วันที่พิจารณาอนุมัติ

      ReqRisks : '-' ,                             // ความเสี่ยงที่อาจพบจากระบบ
      ReqForRM : '-' ,                             // ระบบที่ต้องการตอบรับกับ Roadmap อะไร
      ReqForRMTxt : '-' ,                          // ระบบที่ต้องการตอบรับกับ Roadmap อะไร
                                                   // this.appConfig.GetSelect2TxtByID(RowDB.ReqForRM, this.RoadMapDb )
      ReqRequestor : '-',                          // ชื่อผู้เสนอพัฒนาระบบ(ผู้ร้องขอ)
      ReqProgrammer : '-' ,                        // ผู้พัฒนาที่รับมอบหมาย
      ReqImportance : '-' ,                        // ระดับความสำคัญและเร่งด่วนของระบบ [ระดับ 1 - 5]
      ReqCreateTime : '-' ,                        // ระยะเวลาจัดสร้างโดยประมาณ [วันทำการ]
      ReqAprTOR : '-' ,                            // ข้อตกลงความต้องการของระบบ
      ReqAppConOrther : '-' ,                      // ความสัมพันธ์กับระบบอื่นที่มีอยู่แล้ว
      ReqPartUI : '-' ,                            // ตัวอย่างหน้าจอที่ขอให้จัดสร้าง
      ReqPartRep : '-' ,                           // ตัวอย่างรายงานที่ขอ
      ChkUsrInstaller : '-' ,                      // ชื่อผู้ตรวจการติดตั้ง
      AppCodeCreate : '-' ,                        // รหัสแอพที่พัฒนาในฐานข้อมูลศูนย์คอมฯ
    });
    console.log( this.RequestFrm.getRawValue() );
    this.ShowContent(content);
  }

  ReqComAcceptInfo(RowDB:any, content){
    // console.log( RowDB );
    this.RequestFrm.patchValue({
      ReqType : RowDB.ReqType ,                     // ประเภทการ้องขอ
      ReqNbr : RowDB.ReqNbr ,                       // รหัสคำขอ
      ReqTitle : RowDB.ReqTitle ,                   // ชื่อระบบที่ขอ(ชื่อระบบที่ขอพัฒนา)
      ReqUser : RowDB.ReqUser ,                     // ชื่อผู้ร้องขอ
      ReqReason : RowDB.ReqReason ,                 // เหตุผลความต้องการ
      ReqReturn : RowDB.ReqReturn ,                 // ผลลัพธ์ที่คาดว่าจะได้
      ReqResource : RowDB.ReqResource ,             // ทรัพยากรที่ต้องการใช้เพิ่มเติม
      ReqUsrContact : RowDB.ReqUsrContact ,         // ชื่อผู้ประสานงานในขั้นตอนพัฒนาระบบ
      ReqUsrContactTel : RowDB.ReqUsrContactTel ,   // เบอร์โทรภายในสำหรับงาน

      ChkDupState : RowDB.ChkDupState  ,            // สถานะตรวจสอบคำร้อง [-=รอตรวจ/Y=ซ้ำซ้อน/N=ไม่ซ้ำ]
      ChkDupNote : RowDB.ChkDupNote  ,              // รายละเอียดความซ้ำซ้อนจากการตรวจสอบ
      ChkUsrReceipter : RowDB.ChkUsrReceipter,      // ชื่อผู้ตรวจรับคำร้อง
      ReqAprRes : RowDB.ReqAprRes,                  // ผลการพิจารณา [-รอพิจารณา/Y=อนุมัติ/N=ไม่อนุมัติ/L=ศึกษาเพิ่มเติม]
      ReqAprRemark : RowDB.ReqAprRemark,            // เหตุผลประกอบผลพิจารณา
      ReqAprDate : RowDB.ReqAprDate,                // วันที่พิจารณาอนุมัติ

      ReqRisks : '-' ,                             // ความเสี่ยงที่อาจพบจากระบบ
      ReqForRM : '-' ,                             // ระบบที่ต้องการตอบรับกับ Roadmap อะไร
      ReqForRMTxt : '-' ,                          // ระบบที่ต้องการตอบรับกับ Roadmap อะไร
                                                   // this.appConfig.GetSelect2TxtByID(RowDB.ReqForRM, this.RoadMapDb )
      ReqRequestor : '-',                          // ชื่อผู้เสนอพัฒนาระบบ(ผู้ร้องขอ)
      ReqProgrammer : '-' ,                        // ผู้พัฒนาที่รับมอบหมาย
      ReqImportance : '-' ,                        // ระดับความสำคัญและเร่งด่วนของระบบ [ระดับ 1 - 5]
      ReqCreateTime : '-' ,                        // ระยะเวลาจัดสร้างโดยประมาณ [วันทำการ]
      ReqAprTOR : '-' ,                            // ข้อตกลงความต้องการของระบบ
      ReqAppConOrther : '-' ,                      // ความสัมพันธ์กับระบบอื่นที่มีอยู่แล้ว
      ReqPartUI : '-' ,                            // ตัวอย่างหน้าจอที่ขอให้จัดสร้าง
      ReqPartRep : '-' ,                           // ตัวอย่างรายงานที่ขอ
      ChkUsrInstaller : '-' ,                      // ชื่อผู้ตรวจการติดตั้ง
      AppCodeCreate : '-' ,                        // รหัสแอพที่พัฒนาในฐานข้อมูลศูนย์คอมฯ
    });
    console.log( this.RequestFrm.getRawValue() );
    this.ShowContent(content);
  }

  SaveAcceptReqCom(){
    // console.log( this.RequestFrm.getRawValue() );
    this.http.post(
      this.appConfig.urlApi + 'UpdateReqCom.php',
      { frm: this.RequestFrm.getRawValue() }
    ).subscribe(
      (data:any)=>{
        // console.log( data );
        this.SarchReqCom();
        Swal({
          title: 'บันทึกสถานะตอบรับคำขอคอมฯต่อพ่วง \n เสร็จสมบูรณ์ ?',
          text: '', type: 'success', allowOutsideClick: false,
          showConfirmButton: true, buttonsStyling: true,
          confirmButtonColor: '#0CC27E',
          confirmButtonText: '<i class="icon icon-star"></i> ตกลง',
          confirmButtonClass: 'btn btn-success btn-raised',
        });
        this.RequestFrm.reset();
        this.CloseModals();
      }
    );
  }

  SarchReqApp(){
    // console.log( this.SearchTxt3 );
    this.http.post(
      this.appConfig.urlApi + 'SearchRequestByType.php',
      { stype:'A', year: this.YearReg, stxt: this.SearchTxt3 }
    ).subscribe(
      (data:any) => {
        this.DbReqApp = data;
        // console.log( this.DbReqApp );
      }
    );
  }

  ReqAppAccept(RowDB:any, content){
    // console.log( RowDB );
    var RMname = this.appConfig.GetSelect2TxtByID(RowDB.ReqForRM, this.RoadMapDb);
    this.RequestFrm.reset();
    this.RequestFrm.patchValue({
      // Request
      ReqType : RowDB.ReqType ,                     // ประเภทการ้องขอ
      ReqNbr : RowDB.ReqNbr ,                       // รหัสคำขอ
      ReqTitle : RowDB.ReqTitle ,                   // ชื่อระบบที่ขอ(ชื่อระบบที่ขอพัฒนา)
      ReqUser : RowDB.ReqUser ,                     // ชื่อผู้ร้องขอ
      ReqReason : RowDB.ReqReason ,                 // เหตุผลความต้องการ
      ReqReturn : RowDB.ReqReturn ,                 // ผลลัพธ์ที่คาดว่าจะได้
      ReqResource : RowDB.ReqResource ,             // ทรัพยากรที่ต้องการใช้เพิ่มเติม
      ReqUsrContact : RowDB.ReqUsrContact ,         // ชื่อผู้ประสานงานในขั้นตอนพัฒนาระบบ
      ReqUsrContactTel : RowDB.ReqUsrContactTel ,   // เบอร์โทรภายในสำหรับงาน
      ReqRequestor : RowDB.ReqRequestor,            // ชื่อผู้เสนอพัฒนาระบบ(ผู้ร้องขอ)
      ReqRisks : RowDB.ReqRisks ,                   // ความเสี่ยงที่อาจพบจากระบบ
      ReqAppConOrther : RowDB.ReqAppConOrther ,     // ความสัมพันธ์กับระบบอื่นที่มีอยู่แล้ว
      ReqForRM : RMname ,                           // ระบบที่ต้องการตอบรับกับ Roadmap อะไร
      // Check Duplicate
      ChkDupState : RowDB.ChkDupState  ,            // สถานะตรวจสอบคำร้อง [-=รอตรวจ/Y=ซ้ำซ้อน/N=ไม่ซ้ำ]
      ChkDupNote : RowDB.ChkDupNote  ,              // รายละเอียดความซ้ำซ้อนจากการตรวจสอบ
      ChkUsrReceipter : this.UsFName,               // ชื่อผู้ตรวจรับคำร้อง
      // Approve
      ReqAprDate : RowDB.ReqAprDate,                // วันที่พิจารณาอนุมัติ
      ReqAprRes : '-' ,                             // ผลการพิจารณา [-รอพิจารณา/Y=อนุมัติ/N=ไม่อนุมัติ/L=ศึกษาเพิ่มเติม]
      ReqAprRemark : null,                          // เหตุผลประกอบผลพิจารณา
      ReqImportance :  RowDB.ReqImportance ,        // ระดับความสำคัญและเร่งด่วนของระบบ [ระดับ 1 - 5]
      ReqProgrammer :  RowDB.ReqProgrammer ,        // ผู้พัฒนาที่รับมอบหมาย
      ReqCreateTime :  RowDB.ReqCreateTime ,        // ระยะเวลาจัดสร้างโดยประมาณ [วันทำการ]
      // Procecc App
      ReqPartUI : '-' ,                            // ตัวอย่างหน้าจอที่ขอให้จัดสร้าง
      ReqAprTOR : '-' ,                            // ข้อตกลงความต้องการของระบบ
      ChkUsrInstaller : '-' ,                      // ชื่อผู้ตรวจการติดตั้ง
      AppCodeCreate : '-' ,                        // รหัสแอพที่พัฒนาในฐานข้อมูลศูนย์คอมฯ
      ReqPartRep : '-' ,                           // ตัวอย่างรายงานที่ขอ
      ReqForRMTxt : '-' ,                          // ระบบที่ต้องการตอบรับกับ Roadmap อะไร
    });
    console.log( this.RequestFrm.getRawValue() );
    this.ShowContent(content);
  }

  ReqAppAcceptInfoo(RowDB:any, content){
    // console.log( RowDB );
    var RMname = this.appConfig.GetSelect2TxtByID(RowDB.ReqForRM, this.RoadMapDb);
    var ProgName = this.appConfig.GetSelect2TxtByID(RowDB.ReqProgrammer, this.DbProgramer);
    this.RequestFrm.reset();
    this.RequestFrm.patchValue({
      // Request
      ReqType : RowDB.ReqType ,                     // ประเภทการ้องขอ
      ReqNbr : RowDB.ReqNbr ,                       // รหัสคำขอ
      ReqTitle : RowDB.ReqTitle ,                   // ชื่อระบบที่ขอ(ชื่อระบบที่ขอพัฒนา)
      ReqUser : RowDB.ReqUser ,                     // ชื่อผู้ร้องขอ
      ReqReason : RowDB.ReqReason ,                 // เหตุผลความต้องการ
      ReqReturn : RowDB.ReqReturn ,                 // ผลลัพธ์ที่คาดว่าจะได้
      ReqResource : RowDB.ReqResource ,             // ทรัพยากรที่ต้องการใช้เพิ่มเติม
      ReqUsrContact : RowDB.ReqUsrContact ,         // ชื่อผู้ประสานงานในขั้นตอนพัฒนาระบบ
      ReqUsrContactTel : RowDB.ReqUsrContactTel ,   // เบอร์โทรภายในสำหรับงาน
      ReqRequestor : RowDB.ReqRequestor,            // ชื่อผู้เสนอพัฒนาระบบ(ผู้ร้องขอ)
      ReqRisks : RowDB.ReqRisks ,                   // ความเสี่ยงที่อาจพบจากระบบ
      ReqAppConOrther : RowDB.ReqAppConOrther ,     // ความสัมพันธ์กับระบบอื่นที่มีอยู่แล้ว
      ReqForRM : RMname ,                           // ระบบที่ต้องการตอบรับกับ Roadmap อะไร
      ReqPartUI :  RowDB.ReqPartUI  ,              // ตัวอย่างหน้าจอที่ขอให้จัดสร้าง
      // Check Duplicate
      ChkDupState : RowDB.ChkDupState  ,            // สถานะตรวจสอบคำร้อง [-=รอตรวจ/Y=ซ้ำซ้อน/N=ไม่ซ้ำ]
      ChkDupNote : RowDB.ChkDupNote  ,              // รายละเอียดความซ้ำซ้อนจากการตรวจสอบ
      ChkUsrReceipter : this.UsFName,               // ชื่อผู้ตรวจรับคำร้อง
      // Approve
      ReqAprDate : RowDB.ReqAprDate,                // วันที่พิจารณาอนุมัติ
      ReqAprRes : RowDB.ReqAprRes,                  // ผลการพิจารณา [-รอพิจารณา/Y=อนุมัติ/N=ไม่อนุมัติ/L=ศึกษาเพิ่มเติม]
      ReqAprRemark : RowDB.ReqAprRemark,            // เหตุผลประกอบผลพิจารณา
      ReqImportance :  RowDB.ReqImportance ,        // ระดับความสำคัญและเร่งด่วนของระบบ [ระดับ 1 - 5]
      ReqProgrammer :  ProgName ,                   // ผู้พัฒนาที่รับมอบหมาย
      ReqCreateTime :  RowDB.ReqCreateTime ,        // ระยะเวลาจัดสร้างโดยประมาณ [วันทำการ]
      // Procecc App
      ReqAprTOR : '-' ,                            // ข้อตกลงความต้องการของระบบ
      ChkUsrInstaller : '-' ,                      // ชื่อผู้ตรวจการติดตั้ง
      AppCodeCreate : '-' ,                        // รหัสแอพที่พัฒนาในฐานข้อมูลศูนย์คอมฯ
      ReqPartRep : '-' ,                           // ตัวอย่างรายงานที่ขอ
      ReqForRMTxt : '-' ,                          // ระบบที่ต้องการตอบรับกับ Roadmap อะไร
    });
    // console.log( this.RequestFrm.getRawValue() );
    this.ShowContent(content);
  }

  SaveAcceptReqApp(){
    // console.log( this.RequestFrm.getRawValue() );
    this.http.post(
      this.appConfig.urlApi + 'UpdateReqApp.php',
      { frm: this.RequestFrm.getRawValue() }
    ).subscribe(
      (data:any)=>{
        // console.log( data );
        this.SarchReqApp();
        Swal({
          title: 'บันทึกสถานะตอบรับคำขอโปรแกรม \n เสร็จสมบูรณ์ ?',
          text: '', type: 'success', allowOutsideClick: false,
          showConfirmButton: true, buttonsStyling: true,
          confirmButtonColor: '#0CC27E',
          confirmButtonText: '<i class="icon icon-star"></i> ตกลง',
          confirmButtonClass: 'btn btn-success btn-raised',
        });
        this.RequestFrm.reset();
        this.CloseModals();
      }
    );
  }

  SarchReqReport(){
    // console.log( this.SearchTxt4 );
    this.http.post(
      this.appConfig.urlApi + 'SearchRequestByType.php',
      { stype:'R', year: this.YearReg, stxt: this.SearchTxt4 }
    ).subscribe(
      (data:any) => {
        this.DbReqRep = data;
        console.log( this.DbReqRep );
      }
    );
  }

  SaveAcceptReqRep(){
    // console.log( this.RequestFrm.getRawValue() );
    this.http.post(
      this.appConfig.urlApi + 'UpdateReqApp.php',
      { frm: this.RequestFrm.getRawValue() }
    ).subscribe(
      (data:any)=>{
        // console.log( data );
        this.SarchReqReport();
        Swal({
          title: 'บันทึกสถานะตอบรับคำขอรายงาน \n เสร็จสมบูรณ์ ?',
          text: '', type: 'success', allowOutsideClick: false,
          showConfirmButton: true, buttonsStyling: true,
          confirmButtonColor: '#0CC27E',
          confirmButtonText: '<i class="icon icon-star"></i> ตกลง',
          confirmButtonClass: 'btn btn-success btn-raised',
        });
        this.RequestFrm.reset();
        this.CloseModals();
      }
    );
  }

  ReqRepAccept(RowDB:any, content){
    // console.log( RowDB );
    var RMname = this.appConfig.GetSelect2TxtByID(RowDB.ReqForRM, this.RoadMapDb);
    this.RequestFrm.reset();
    this.RequestFrm.patchValue({
      // Request
      ReqType : RowDB.ReqType ,                     // ประเภทการ้องขอ
      ReqNbr : RowDB.ReqNbr ,                       // รหัสคำขอ
      ReqTitle : RowDB.ReqTitle ,                   // ชื่อระบบที่ขอ(ชื่อระบบที่ขอพัฒนา)
      ReqUser : RowDB.ReqUser ,                     // ชื่อผู้ร้องขอ
      ReqReason : RowDB.ReqReason ,                 // เหตุผลความต้องการ
      ReqReturn : RowDB.ReqReturn ,                 // ผลลัพธ์ที่คาดว่าจะได้
      ReqResource : RowDB.ReqResource ,             // ทรัพยากรที่ต้องการใช้เพิ่มเติม
      ReqUsrContact : RowDB.ReqUsrContact ,         // ชื่อผู้ประสานงานในขั้นตอนพัฒนาระบบ
      ReqUsrContactTel : RowDB.ReqUsrContactTel ,   // เบอร์โทรภายในสำหรับงาน
      ReqRequestor : RowDB.ReqRequestor,            // ชื่อผู้เสนอพัฒนาระบบ(ผู้ร้องขอ)
      ReqRisks : RowDB.ReqRisks ,                   // ความเสี่ยงที่อาจพบจากระบบ
      ReqAppConOrther : RowDB.ReqAppConOrther ,     // ความสัมพันธ์กับระบบอื่นที่มีอยู่แล้ว
      ReqForRM : RMname ,                           // ระบบที่ต้องการตอบรับกับ Roadmap อะไร
      ReqPartUI : RowDB.ReqPartUI ,                 // ตัวอย่างหน้าจอที่ขอให้จัดสร้าง
      // Check Duplicate
      ChkDupState : RowDB.ChkDupState  ,            // สถานะตรวจสอบคำร้อง [-=รอตรวจ/Y=ซ้ำซ้อน/N=ไม่ซ้ำ]
      ChkDupNote : RowDB.ChkDupNote  ,              // รายละเอียดความซ้ำซ้อนจากการตรวจสอบ
      ChkUsrReceipter : this.UsFName,               // ชื่อผู้ตรวจรับคำร้อง
      // Approve
      ReqAprDate : RowDB.ReqAprDate,                // วันที่พิจารณาอนุมัติ
      ReqAprRes : '-' ,                             // ผลการพิจารณา [-รอพิจารณา/Y=อนุมัติ/N=ไม่อนุมัติ/L=ศึกษาเพิ่มเติม]
      ReqAprRemark : null,                          // เหตุผลประกอบผลพิจารณา
      ReqImportance :  RowDB.ReqImportance ,        // ระดับความสำคัญและเร่งด่วนของระบบ [ระดับ 1 - 5]
      ReqProgrammer :  RowDB.ReqProgrammer ,        // ผู้พัฒนาที่รับมอบหมาย
      ReqCreateTime :  RowDB.ReqCreateTime ,        // ระยะเวลาจัดสร้างโดยประมาณ [วันทำการ]
      // Procecc App
      ReqAprTOR : '-' ,                            // ข้อตกลงความต้องการของระบบ
      ChkUsrInstaller : '-' ,                      // ชื่อผู้ตรวจการติดตั้ง
      AppCodeCreate : '-' ,                        // รหัสแอพที่พัฒนาในฐานข้อมูลศูนย์คอมฯ
      ReqPartRep : '-' ,                           // ตัวอย่างรายงานที่ขอ
      ReqForRMTxt : '-' ,                          // ระบบที่ต้องการตอบรับกับ Roadmap อะไร
    });
    console.log( this.RequestFrm.getRawValue() );
    this.ShowContent(content);
  }

  ReqRepAcceptInfo(RowDB:any, content){
    // console.log( RowDB );
    var RMname = this.appConfig.GetSelect2TxtByID(RowDB.ReqForRM, this.RoadMapDb);
    var Reporter = this.appConfig.GetSelect2TxtByID(RowDB.ReqProgrammer, this.DbReporter);
    this.RequestFrm.reset();
    this.RequestFrm.patchValue({
      // Request
      ReqType : RowDB.ReqType ,                     // ประเภทการ้องขอ
      ReqNbr : RowDB.ReqNbr ,                       // รหัสคำขอ
      ReqTitle : RowDB.ReqTitle ,                   // ชื่อระบบที่ขอ(ชื่อระบบที่ขอพัฒนา)
      ReqUser : RowDB.ReqUser ,                     // ชื่อผู้ร้องขอ
      ReqReason : RowDB.ReqReason ,                 // เหตุผลความต้องการ
      ReqReturn : RowDB.ReqReturn ,                 // ผลลัพธ์ที่คาดว่าจะได้
      ReqResource : RowDB.ReqResource ,             // ทรัพยากรที่ต้องการใช้เพิ่มเติม
      ReqUsrContact : RowDB.ReqUsrContact ,         // ชื่อผู้ประสานงานในขั้นตอนพัฒนาระบบ
      ReqUsrContactTel : RowDB.ReqUsrContactTel ,   // เบอร์โทรภายในสำหรับงาน
      ReqRequestor : RowDB.ReqRequestor,            // ชื่อผู้เสนอพัฒนาระบบ(ผู้ร้องขอ)
      ReqRisks : RowDB.ReqRisks ,                   // ความเสี่ยงที่อาจพบจากระบบ
      ReqAppConOrther : RowDB.ReqAppConOrther ,     // ความสัมพันธ์กับระบบอื่นที่มีอยู่แล้ว
      ReqForRM : RMname ,                           // ระบบที่ต้องการตอบรับกับ Roadmap อะไร
      ReqPartUI : RowDB.ReqPartUI ,                 // ตัวอย่างหน้าจอที่ขอให้จัดสร้าง
      // Check Duplicate
      ChkDupState : RowDB.ChkDupState  ,            // สถานะตรวจสอบคำร้อง [-=รอตรวจ/Y=ซ้ำซ้อน/N=ไม่ซ้ำ]
      ChkDupNote : RowDB.ChkDupNote  ,              // รายละเอียดความซ้ำซ้อนจากการตรวจสอบ
      ChkUsrReceipter : this.UsFName,               // ชื่อผู้ตรวจรับคำร้อง
      // Approve
      ReqAprDate : RowDB.ReqAprDate,                // วันที่พิจารณาอนุมัติ
      ReqAprRes : '-' ,                             // ผลการพิจารณา [-รอพิจารณา/Y=อนุมัติ/N=ไม่อนุมัติ/L=ศึกษาเพิ่มเติม]
      ReqAprRemark : null,                          // เหตุผลประกอบผลพิจารณา
      ReqImportance :  RowDB.ReqImportance ,        // ระดับความสำคัญและเร่งด่วนของระบบ [ระดับ 1 - 5]
      ReqProgrammer :  Reporter ,                   // ผู้พัฒนาที่รับมอบหมาย
      ReqCreateTime :  RowDB.ReqCreateTime ,        // ระยะเวลาจัดสร้างโดยประมาณ [วันทำการ]
      // Procecc App
      ReqAprTOR : '-' ,                            // ข้อตกลงความต้องการของระบบ
      ChkUsrInstaller : '-' ,                      // ชื่อผู้ตรวจการติดตั้ง
      AppCodeCreate : '-' ,                        // รหัสแอพที่พัฒนาในฐานข้อมูลศูนย์คอมฯ
      ReqPartRep : '-' ,                           // ตัวอย่างรายงานที่ขอ
      ReqForRMTxt : '-' ,                          // ระบบที่ต้องการตอบรับกับ Roadmap อะไร
    });
    // console.log( this.RequestFrm.getRawValue() );
    this.ShowContent(content);
  }

}
