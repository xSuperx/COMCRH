import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../configs/app-config';

@Injectable()
export class AuthService {
  token: string;

  private SubjectLogin = new Subject<boolean>();
  SubjectLoginChangeEmitted$ = this.SubjectLogin.asObservable();
  emitCustomizerChange( change: any ){
    this.SubjectLogin.next( change );
  }

  constructor(
    private router :Router,
    private http :HttpClient,
    private Config :AppConfig
  ){}

  signinUser( xUser: string, xPass: string ){
    if( xUser!='' && xPass!='' ){
      this.http.post( this.Config.urlApi + "authen.php", { username: xUser, password: xPass }
      //this.http.get( this.Config.urlApi + "authen.php?us="+xUser+"&pw="+xPass
      ).subscribe(
        (data:any)=>{
          //console.log( data );
          //console.log( data.length );
          if( data.length > 0 ){
            localStorage.setItem( 'LgUserPID', data[0].pid );
            localStorage.setItem( 'LgUserCode', data[0].username );
            localStorage.setItem( 'LgUsrFullName', data[0].fullname );
            localStorage.setItem( 'LgUsrPosCode', data[0].posicode );
            localStorage.setItem( 'LgUsrPosName', data[0].posiname );
            localStorage.setItem( 'LgUsrAdmin', data[0].posadmin );
            localStorage.setItem( 'LgLogedin', "true" );
            this.emitCustomizerChange( true );
            // this.ReturnState = true;
            // return true;
          }
          else{
            localStorage.removeItem( 'LgUserPID' );
            localStorage.removeItem( 'LgUserCode' );
            localStorage.removeItem( 'LgUsrFullName' );
            localStorage.removeItem( 'LgUsrPosCode' );
            localStorage.removeItem( 'LgUsrPosName' );
            localStorage.removeItem( 'LgUsrAdmin' );
            localStorage.removeItem( 'LgLogedin' );
            // this.ReturnState = false;
            this.emitCustomizerChange( false );
          }
        }
      );
    }else{
      // this.ReturnState = false;
      this.emitCustomizerChange( false  );
    }
    // console.log( "ReturnState: " + this.ReturnState  );
    // return this.ReturnState;
  }

  logout(){
    localStorage.removeItem( 'LgUserPID' );
    localStorage.removeItem( 'LgUserCode' );
    localStorage.removeItem( 'LgUsrFullName' );
    localStorage.removeItem( 'LgUsrPosCode' );
    localStorage.removeItem( 'LgUsrPosName' );
    localStorage.removeItem( 'LgUsrAdmin' );
    localStorage.removeItem( 'LgLogedin' );
    this.token = null;
    this.emitCustomizerChange( false );
    this.router.navigate([ "/infopanel" ]);
  }

  getToken() {
    return this.token;
  }

  isAuthenticated() {
    if( localStorage.getItem('LgLogedin') ){
      return true;
    }else{
      return false;
    }
  }

}
