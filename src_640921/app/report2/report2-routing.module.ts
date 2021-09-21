import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Report2Component } from './report2.component';

const routes: Routes = [
  { path: '', component: Report2Component }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class Report2RoutingModule { }
