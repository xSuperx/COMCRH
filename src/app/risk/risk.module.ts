import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RiskRoutingModule } from './risk-routing.module';
import { RiskComponent } from './risk.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [RiskComponent],
  imports: [
    CommonModule,
    RiskRoutingModule,
    NgbModule,
    FormsModule,
    NgxDatatableModule,
    NgSelectModule,
    SharedModule
  ]
})
export class RiskModule { }
