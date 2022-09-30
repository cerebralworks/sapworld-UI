import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/guard/auth.guard';
import { Role } from '@data/schema/role';
import { HomeComponent } from './home/home.component';
import {PostedJobComponent} from '@modules/features/employer/posted-job/posted-job.component'
const routes: Routes = [
  
  {
    path: 'home',
    loadChildren: () =>
      import('@modules/features/common/home/home.module').then(m => m.HomeModule)
  },
  {
    path: '',
    loadChildren: () =>
      import('@modules/features/common/landing/landing.module').then(m => m.LandingModule)
  },
  {
    path: 'find-candidates',
    data: { roles: [Role.Admin, Role.Employer] },
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('@modules/features/common/find-candidates/find-candidates.module').then(m => m.FindCandidatesModule)
  },
  {
    path: 'admin/post-job/:id',
    loadChildren: () =>
      import('@modules/features/employer/post-job/post-job.module').then(m => m.PostJobModule)
  },{
    path: 'admin/employer-dashboard',
    loadChildren: () =>
      import('@modules/features/employer/employer-dashboard/employer-dashboard.module').then(m => m.EmployerDashboardModule)
  },{
	path: 'admin/job-view/:id',
	loadChildren: () =>
	  import('@modules/features/employer/job-detail-view/job-detail-view.module').then(m => m.JobDetailViewModule)
	},
  {
    path: 'admin/job-candidate-matches',
    loadChildren: () =>
      import('@modules/features/employer/employer-candidate-profile-matches/employer-candidate-profile-matches.module').then(m => m.EmployerCandidateProfileMatchesModule)
  },{
    path: 'admin/candidate-profile',
    loadChildren: () =>
      import('@modules/features/employer/employer-candidate-profile-view/employer-candidate-profile-view.module').then(m => m.EmployerCandidateProfileViewModule)
  },{
    path: 'admin/job-multiple-candidate-matches',
    loadChildren: () =>
      import('@modules/features/employer/employer-candidate-multiple-profile-matches/employer-candidate-multiple-profile-matches.module').then(m => m.EmployerCandidateMultipleProfileMatchesModule)
  },{
    path: 'find-jobs',
    loadChildren: () =>
      import('@modules/features/common/find-jobs/find-jobs.module').then(m => m.FindJobsModule)
  },
  {
    path: 'notification',
    data: { roles: [Role.Admin,Role.User, Role.Employer] },
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('@modules/features/common/notification/notification.module').then(m => m.NotificationModule)
  },
  {
    path: 'verify',
    loadChildren: () =>
      import('@modules/features/common/verify-account/verify-account.module').then(m => m.VerifyAccountModule)
  },
  {
    path: 'not-found',
    loadChildren: () =>
      import('@modules/features/common/not-found/not-found.module').then(m => m.NotFoundModule)
  },
  {
    path: 'reset-password',
    loadChildren: () =>
      import('@modules/features/common/reset-password/reset-password.module').then(m => m.ResetPasswordModule)
  },
  {
    path: 'privacy-policy',
    loadChildren: () =>
      import('@modules/features/common/privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyModule)
  },
  {
    path: 'terms-and-conditions',
    loadChildren: () =>
      import('@modules/features/common/terms-condition/terms-condition.module').then(m => m.TermsConditionModule)
  },{
    path: 'linkedin-share',
    loadChildren: () =>
      import('@modules/features/employer/job-detail-view/job-detail-view.module').then(m => m.JobDetailViewModule)
  },
  {
    path: 'cookie-policy',
    loadChildren: () =>
      import('@modules/features/common/cookie-policy/cookie-policy.module').then(m => m.CookiePolicyModule)
  },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonRoutingModule { }
