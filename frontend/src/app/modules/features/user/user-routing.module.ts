import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/guard/auth.guard';
import { Role } from '@data/schema/role';

const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin, Role.User] },
    loadChildren: () =>
      import('@modules/features/user/user-dashboard/user-dashboard.module').then(m => m.UserDashboardModule)
  },
  {
    path: 'create-candidate',
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin, Role.User] },
    loadChildren: () =>
      import('@modules/features/user/profile/create-candidate/create-candidate.module').then(m => m.CreateCandidateModule)
  },
  {
    path: 'job-matches/details',
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin, Role.User] },
    loadChildren: () =>
      import('@modules/features/user/candidate-job-matches/candidate-job-matches.module').then(m => m.CandidateJobMatchesModule)
  },
  {
    path: 'multiple-job-matches',
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin, Role.User] },
    loadChildren: () =>
      import('@modules/features/user/candidate-multiple-job-matches/candidate-multiple-job-matches.module').then(m => m.CandidateMultipleJobMatchesModule)
  },
  {
    path: 'profile-setting',
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin, Role.User] },
    loadChildren: () =>
      import('@modules/features/user/profile/user-setting/user-setting.module').then(m => m.UserSettingModule)
  },
  {
    path: 'candidate-job-view/details',
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin, Role.User] },
    loadChildren: () =>
      import('@modules/features/user/candidate-job-view/candidate-job-view.module').then(m => m.CandidateJobViewModule)
  },
  {
    path: 'calendar',
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin, Role.User] },
    loadChildren: () =>
      import('@modules/features/user/calendar/calendar.module').then(m => m.CalendarModules)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
