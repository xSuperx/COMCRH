import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RiskComponent } from './risk.component';

const routes: Routes = [ { path: '', component: RiskComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class RiskRoutingModule { }
