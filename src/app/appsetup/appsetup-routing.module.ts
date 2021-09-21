import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppsetupComponent } from './appsetup.component';

const routes: Routes = [
  { path: '', component: AppsetupComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AppsetupRoutingModule { }
