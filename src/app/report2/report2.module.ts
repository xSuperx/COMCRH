import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Report2RoutingModule } from './report2-routing.module';
import { Report2Component } from './report2.component';
import { SharedModule } from 'app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgpSortModule } from 'ngp-sort-pipe';
import { MyDatePickerModule } from 'mydatepicker';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    Report2Component
  ],
  imports: [
    CommonModule,
    Report2RoutingModule,
    NgbModule,
    SharedModule,
    FormsModule,
    NgxDatatableModule,
    NgSelectModule,
    MyDatePickerModule,
    NgpSortModule,
    ReactiveFormsModule,
    ChartsModule
  ]
})

export class Report2Module { }
