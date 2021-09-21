import { ActivitiesComponent } from './activities.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimelineComponent } from './timeline/timeline.component';

const routes: Routes = [
  { path: '', component: ActivitiesComponent },
  { path: 'timeline', component: TimelineComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivitiesRoutingModule {}
