import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ActivitiesRoutingModule } from './activities-routing.module';
import { ActivitiesComponent } from './activities.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../shared/shared.module';
import { NgGanttEditorModule } from 'ng-gantt';
import { TimelineComponent } from './timeline/timeline.component';
import { NgpSortModule } from "ngp-sort-pipe";
import { MyDatePickerModule } from "mydatepicker";

@NgModule({
  declarations: [
    ActivitiesComponent,
    TimelineComponent
  ],
  imports: [
    CommonModule,
    ActivitiesRoutingModule,
    NgbModule,
    FormsModule,
    NgxDatatableModule,
    NgSelectModule,
    SharedModule,
    NgGanttEditorModule,
    ReactiveFormsModule,
    MyDatePickerModule,
    NgpSortModule
  ],
})

export class ActivitiesModule {}
