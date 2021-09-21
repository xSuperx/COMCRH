import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { FullLayoutComponent } from "./layouts/full/full-layout.component";
import { ContentLayoutComponent } from "./layouts/content/content-layout.component";
import { AuthGuard } from './shared/auth/auth-guard.service';
import { FeedbackComponent } from './feedback/feedback.component';
import { ReqcomComponent } from './reqcom/reqcom.component';
import { ReqrepComponent } from './reqrep/reqrep.component';
import { ReqanswerComponent } from './reqanswer/reqanswer.component';
import { Activities2Component } from './activities2/activities2.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'infopanel', pathMatch: 'full', },
  { path: 'userlogin', loadChildren: './userlogin/userlogin.module#UserloginModule' },
  { path: 'infopanel', loadChildren: './infopanel/infopanel.module#InfopanelModule' },
  { path: 'reports', loadChildren: './reports/reports.module#ReportsModule' },
  { path: 'report2', loadChildren: './report2/report2.module#Report2Module' },
  { path: 'reqapp', loadChildren: './reqapp/reqapp.module#ReqappModule' },
  { path: 'deptnotified', loadChildren: './deptnotified/deptnotified.module#DeptnotifiedModule' },
  { path: 'activities', loadChildren: './activities/activities.module#ActivitiesModule', canActivate: [AuthGuard] },
  { path: 'servicelog', loadChildren: './servicelog/servicelog.module#ServicelogModule', canActivate: [AuthGuard] },
  { path: 'appsetup', loadChildren: './appsetup/appsetup.module#AppsetupModule', canActivate: [AuthGuard] },
  { path: 'risk', loadChildren: './risk/risk.module#RiskModule', canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'pages/error' },
  { path: 'activities2', component: Activities2Component, canActivate: [AuthGuard] },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'reqcom', component: ReqcomComponent },
  { path: 'reqrep', component: ReqrepComponent },
  { path: 'reqanswer', component: ReqanswerComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {
}