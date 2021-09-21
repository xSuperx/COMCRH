import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfopanelRoutingModule } from './infopanel-routing.module';
import { InfopanelComponent } from './infopanel.component';
import { ChartistModule } from 'ng-chartist';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'app/shared/shared.module';
import { NgpSortModule } from "ngp-sort-pipe";
// import { RiskComponent } from './risk/risk.component';

@NgModule({
  declarations: [
    InfopanelComponent,
    // RiskComponent
  ],
  imports: [
    CommonModule,
    InfopanelRoutingModule,
    ChartistModule,
    NgxChartsModule,
    NgbModule,
    SharedModule,
    NgpSortModule
  ]
})

export class InfopanelModule { }
