import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReqappRoutingModule } from './reqapp-routing.module';
import { ReqappComponent } from './reqapp.component';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgpSortModule } from 'ngp-sort-pipe';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  declarations: [
    ReqappComponent
  ],
  imports: [
    CommonModule,
    ReqappRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgSelectModule,
    SharedModule,
    NgpSortModule,
    FileUploadModule
  ]
})

export class ReqappModule { }
