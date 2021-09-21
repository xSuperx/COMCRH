import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserloginRoutingModule } from './userlogin-routing.module';
import { UserloginComponent } from './userlogin.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    UserloginComponent
  ],
  imports: [
    CommonModule,
    UserloginRoutingModule,
    FormsModule
  ],
  exports: [
    FormsModule
  ]
})

export class UserloginModule { }
