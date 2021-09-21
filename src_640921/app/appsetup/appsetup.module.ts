import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppsetupRoutingModule } from './appsetup-routing.module';
import { AppsetupComponent } from './appsetup.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [
    AppsetupComponent
  ],
  imports: [
    CommonModule,
    AppsetupRoutingModule,
    NgbModule,
    FormsModule,
    NgxDatatableModule,
    NgSelectModule,
    SharedModule
  ]
})

export class AppsetupModule { }
