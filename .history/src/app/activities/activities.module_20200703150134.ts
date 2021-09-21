import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ActivitiesRoutingModule } from './activities-routing.module';
import { ActivitiesComponent } from './activities.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../shared/shared.module';
import { TimeLineComponent } from './time-line/time-line.component';
import { NgGanttEditorModule } from 'ng-gantt';
@NgModule({
  declarations: [ActivitiesComponent, TimeLineComponent],
  imports: [
    CommonModule,
    ActivitiesRoutingModule,
    NgbModule,
    FormsModule,
    NgxDatatableModule,
    NgSelectModule,
    SharedModule,
    NgGanttEditorModule,
  ],
})
export class ActivitiesModule {}
