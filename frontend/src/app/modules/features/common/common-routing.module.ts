import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/guard/auth.guard';
import { Role } from '@data/schema/role';
import { HomeComponent } from './home/home.component';

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
    path: 'reset-password',
    loadChildren: () =>
      import('@modules/features/common/reset-password/reset-password.module').then(m => m.ResetPasswordModule)
  },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonRoutingModule { }
