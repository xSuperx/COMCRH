import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalConfig, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AppConfig } from 'app/shared/configs/app-config';
import { FileUploader } from 'ng2-file-upload';
import Swal from 'sweetalert2';
// import * as XLSX from 'xlsx';
const url :any = 'http://172.16.1.32:80/ComAPI/UploadDocsAppRequest.php';

@Component({
  selector: 'app-reqrep',
  templateUrl: './reqrep.component.html',
  styleUrls: ['./reqrep.component.scss']
})

export class ReqrepComponent implements OnInit {
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

  RowPerPage = 10;
  DbRegApp = [];
  PageApp = 1;

  RequestFrm = new FormGroup ({
    ReqNbr: new FormControl( null, { validators: Validators.required } ),
    ReqType: new FormControl( null, { validators: Validators.required } ),
    ReqRequestor: new FormControl( null, { validators: Validators.required } ),
    ReqUser: new FormControl( null, { validators: Validators.required } ),
    ReqUsrContact: new FormControl( null, { validators: Validators.required } ),
    ReqUsrContactTel: new FormControl( null, { validators: Validators.required } ),
    ReqTitle: new FormControl( null, { validators: Validators.required } ),
    ReqReason: new FormControl( null, { validators: Validators.required } ),
    ReqReturn: new FormControl( null, { validators: Validators.required } ),
    ReqRisks: new FormControl( null, { validators: Validators.required } ),
    ReqResource: new FormControl( null, { validators: Validators.required } ),
    ReqAppConOrther: new FormControl( null, { validators: Validators.required } ),
    ReqForRM: new FormControl( null, { validators: Validators.required } ),
    ReqPartUI: new FormControl( null, { validators: Validators.required } )
  });

  RoadMapDb = [
    { id:'R01', text:'อัตราการเสียชีวิตผู้ป่วยโรคหัวใจ < 8%'},
    { id:'R02', text:'อัตราการเสียชีวิตผู้ป่วยโรคหลอดเลือดสมอง (I60-I69) น้อยกว่าหรือเท่ากับ 7%'},
    { id:'R03', text:'อัตราตายของผู้ป่วยอุบัติเหตุน้อยกว่า 16 ต่อแสนประชากร'},
    { id:'R04', text:'อัตราการเสียชีวิตในโรคที่สำคัญทางอายุรกรรมลดลง'},
    { id:'R05', text:'อัตราการเสียชีวิตในโรคสำคัญทางศัลยกรรม UGIH, CA breast ลดลง 3%'},
    { id:'R06', text:'อัตราการเสียชีวิตในโรคที่สำคัญทางศัลยกรรมออร์โธปิดิกส์ ลดลง 10 %'},
    { id:'R07', text:'อัตราตายของมารดา < 15 : 100,000'},
    { id:'R08', text:'อัตราการเสียชีวิตของผู้ป่วยเด็ก <1%'},
    { id:'R09', text:'ระดับความสำเร็จการพัฒนาคุณภาพงานบริการผู้ป่วยจักษุ'},
    { id:'R10', text:'ระดับความสำเร็จการพัฒนาคุณภาพงานบริการผู้ป่วยโสต ศอ นาสิก'},
    { id:'R11', text:'อัตราการรอดชีวิตของผู้ป่วยโรคมะเร็ง เพิ่มขึ้น 3%'},
    { id:'R12', text:'ระดับความสำเร็จในการบรรลุผลสัมฤทธิ์การพัฒนาระบบการรับบริจาคและปลูกถ่ายอวัยวะ'},
    { id:'R13', text:'จิตเวช'},
    { id:'R14', text:'ระดับความสำเร็จในการบรรลุผลสัมฤทธ์ การพัฒนา ระบบการดูแล ในกลุ่มโรคในช่องปาก'},
    { id:'R15', text:'อัตราข้อผิดพลาดในระบบงานที่สำคัญลดลง 10%'},
    { id:'R16', text:'อัตราการสร้างเสริมสุขภาพตามกลุ่มวัยไม่น้อยกว่า ร้อยละ 80'},
    { id:'R17', text:'อัตราความสำเร็จของโครงการป้องกัน ควบคุมโรคที่สามารถป้องกันได้ร้อยละ 70'},
    { id:'R18', text:'อัตราผลสำเร็จการดำเนินงานพัฒนาระบบบริการปฐมภูมิ ร้อยละ 80'},
    { id:'R19', text:'อัตราการคงอยู่ในระบบของบัณฑิตแพทย์ ที่ผลิตโครงการ CPIRD 3ปี ODOD 12 ปี > 80%'},
    { id:'R20', text:'ศูนย์สหวิชาชีพศาสตร์ศึกษา'},
    { id:'R21', text:'การตีพิมพ์เผยแพร่ระดับชาติ / นานาชาติ'},
    { id:'R22', text:'Premium'},
    { id:'R23', text:'ระดับความสำเร็จของผู้ป่วยในระบบบริการได้รับบริการทางสุขภาพแบบองค์รวม'},
    { id:'R24', text:'อัตราการบรรลุผลสัมฤทธิ์ของโครงการความร่วมมือในการจัดการสุขภาพกับภาคีเครือข่าย'},
    { id:'R25', text:'อุบัติการณ์ความผิดพลาดในระบบสนับสนุน=0'},
    { id:'R26', text:'Financial  Management'},
    { id:'R27', text:'อัตราการลาออกจากงานของบุคลากร Turnover rate น้อยกว่า 3 %'},
    { id:'R28', text:'ระดับความสำเร็จในการบรรลุผลสัมฤทธิ์ ปี 2561 การเป็นศูนย์การแพทย์ชั้นเลิศในดวงใจแห่งอนุภูมิภาคลุ่มน้ำโขง'},
    { id:'R29', text:'อัตราการใช้สารสนเทศเพื่อการบริหารจัดการระบบบริการ มากกว่าหรือเท่ากับร้อยละ 60'},
    { id:'R30', text:'ตัวชี้วัดกลาง/PAกระทรวง/นโยบายโรงพยาบาล/งานท้าทาย'},
  ];

  ngOnInit(){
    this.GetRequestReport();
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
        this.DbRegApp = data;
        // console.log( this.DbRegApp );
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

}
