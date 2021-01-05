import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('@modules/features/user/user-dashboard/user-dashboard.module').then(m => m.UserDashboardModule)
  },
  {
    path: 'create-candidate',
    loadChildren: () =>
      import('@modules/features/user/profile/create-candidate/create-candidate.module').then(m => m.CreateCandidateModule)
  },
  {
    path: 'job-matches/:id',
    loadChildren: () =>
      import('@modules/features/user/candidate-job-matches/candidate-job-matches.module').then(m => m.CandidateJobMatchesModule)
  },
  {
    path: 'multiple-job-matches',
    loadChildren: () =>
      import('@modules/features/user/candidate-multiple-job-matches/candidate-multiple-job-matches.module').then(m => m.CandidateMultipleJobMatchesModule)
  },
  {
    path: 'profile-setting',
    loadChildren: () =>
      import('@modules/features/user/profile/user-setting/user-setting.module').then(m => m.UserSettingModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
