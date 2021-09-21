import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DeptnotifiedRoutingModule } from './deptnotified-routing.module';
import { DeptnotifiedComponent } from './deptnotified.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../shared/shared.module';
import { ArchwizardModule } from 'angular-archwizard';
// import { ArchwizardComponent } from 'app/forms/archwizard/archwizard.component';


@NgModule({
  declarations: [
    DeptnotifiedComponent,
    // ArchwizardComponent
  ],
  imports: [
    CommonModule,
    DeptnotifiedRoutingModule,
    NgbModule,
    FormsModule,
    NgxDatatableModule,
    NgSelectModule,
    SharedModule,
    ArchwizardModule
  ]
})

export class DeptnotifiedModule { }
