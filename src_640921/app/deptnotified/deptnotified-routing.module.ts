import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeptnotifiedComponent } from './deptnotified.component';

const routes: Routes = [
  { path: '', component: DeptnotifiedComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeptnotifiedRoutingModule { }
