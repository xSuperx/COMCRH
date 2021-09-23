import { Component, OnInit, ViewChild  } from '@angular/core';
import { AuthService } from 'app/shared/auth/auth.service';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-userlogin',
  templateUrl: './userlogin.component.html',
  styleUrls: ['./userlogin.component.scss']
})

export class UserloginComponent implements OnInit {
  LoginSub: any;
  islogin: boolean;
  LoginState :boolean;
  model:any = { xUser:'', xPass:'', LogIncheck:'' };

  constructor(
    private AthService :AuthService,
    private router :Router,
    private authService :AuthService
  ){}

  ngOnInit(){
    this.LoginSub = this.authService.SubjectLoginChangeEmitted$.subscribe(
      islogin =>{
        this.islogin = islogin;
        // console.log(this.islogin);
        if( this.islogin ){
          //console.log( localStorage );
          var ChkUsName = localStorage.getItem( 'LgUsrFullName' );
          var ChkUsPos = localStorage.getItem( 'LgUsrPosCode' );
          if( ChkUsName === 'undefined' ){ ChkUsName = "-"; }
          else if( ChkUsName == "" ){ ChkUsName = "-"; }
          if( ChkUsPos === 'undefined' ){ ChkUsPos = "-"; }
          else if( ChkUsPos == "" ){ ChkUsPos = "-"; }
          //console.log( "ChkUsName=" + ChkUsName +", ChkUsPos="+ ChkUsPos );

          if( ChkUsName != "-" && ChkUsPos != "-" ){
            this.model.LogIncheck = "";
            this.model.xUser = "";
            this.model.xPass = "";
            this.router.navigate(["/infopanel"]);
          }
          else if( ChkUsName != "-" && ChkUsPos == "-" ){
            this.model.xUser = "";
            this.model.xPass = "";
            this.model.LogIncheck = "ท่านไม่มีสิทธิ์ใช้งานระบบนี้ !!";
          }else{
            this.model.xPass = "";
            this.model.LogIncheck = "รหัสผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง !!";
          }
        }else{
          this.model.xPass = "";
          this.model.LogIncheck = "รหัสผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง หรือท่านไม่มีสิทธิ์ใช้งานในระบบนี้!!";
        }
      }
    );
  }

  onUserLogin( UsLogin: NgForm ){
    if(this.model.xUser!="" && this.model.xPass!=""){
      this.AthService.signinUser( this.model.xUser, this.model.xPass );
    }
    else{
      if(this.model.xUser==""){
        this.model.LogIncheck = "ไม่ระบุรหัสผู้ใช้งาน.";
      }
      else if(this.model.xPass==""){
        this.model.LogIncheck = "ไม่ระบุรหัสผ่าน.";
      }
    }
  }

}
