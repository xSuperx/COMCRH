import { ActivitiesComponent } from './activities.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Timeline } from '@swimlane/ngx-charts';

const routes: Routes = [
  { path: '', component: ActivitiesComponent },
  { path: 'timeline', component: Timeline },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivitiesRoutingModule {}
