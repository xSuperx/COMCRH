import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicelogRoutingModule } from './servicelog-routing.module';
import { ServicelogComponent } from './servicelog.component';

@NgModule({
  declarations: [
    ServicelogComponent
  ],
  imports: [
    CommonModule,
    ServicelogRoutingModule
  ]
})
export class ServicelogModule { }
