import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InfopanelComponent } from './infopanel.component';
// import { RiskComponent } from './risk/risk.component';

const routes: Routes = [
  { path: '', component: InfopanelComponent },
  // { path: 'risk', component: RiskComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class InfopanelRoutingModule { }
