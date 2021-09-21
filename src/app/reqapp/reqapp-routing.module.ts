import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReqappComponent } from './reqapp.component';

const routes: Routes = [
  { path: '', component: ReqappComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ReqappRoutingModule { }
