import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/guard/auth.guard';
import { Role } from '@data/schema/role';

const routes: Routes = [
  {
    path: 'post-job',
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin, Role.Employer] },
    loadChildren: () =>
      import('@modules/features/employer/post-job/post-job.module').then(m => m.PostJobModule)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin, Role.Employer] },
    loadChildren: () =>
      import('@modules/features/employer/employer-dashboard/employer-dashboard.module').then(m => m.EmployerDashboardModule)
  },
  {
    path: 'job-detail-view/:id',
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin, Role.Employer] },
    loadChildren: () =>
      import('@modules/features/employer/job-detail-view/job-detail-view.module').then(m => m.JobDetailViewModule)
  },
  {
    path: 'job-candidate-matches/:jobId/:userId',
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin, Role.Employer] },
    loadChildren: () =>
      import('@modules/features/employer/employer-candidate-profile-matches/employer-candidate-profile-matches.module').then(m => m.EmployerCandidateProfileMatchesModule)
  },
  {
    path: 'job-multiple-candidate-matches',
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin, Role.Employer] },
    loadChildren: () =>
      import('@modules/features/employer/employer-candidate-multiple-profile-matches/employer-candidate-multiple-profile-matches.module').then(m => m.EmployerCandidateMultipleProfileMatchesModule)
  },
  {
    path: 'candidate-profile',
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin, Role.Employer] },
    loadChildren: () =>
      import('@modules/features/employer/employer-candidate-profile-view/employer-candidate-profile-view.module').then(m => m.EmployerCandidateProfileViewModule)
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('@modules/features/employer/profile/employer-profile/employer-profile.module').then(m => m.EmployerProfileModule)
  },
  {
    path: 'create-profile',
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin, Role.Employer] },
    loadChildren: () =>
      import('@modules/features/employer/profile/create-employer-profile/create-employer-profile.module').then(m => m.CreateEmployerProfileModule)
  },
  {
    path: 'setting',
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin, Role.Employer] },
    loadChildren: () =>
      import('@modules/features/employer/profile/employer-setting/employer-setting.module').then(m => m.EmployerSettingModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployerRoutingModule { }
