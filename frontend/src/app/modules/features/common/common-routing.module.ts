import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () =>
      import('@modules/features/common/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'find-candidates',
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
    loadChildren: () =>
      import('@modules/features/common/notification/notification.module').then(m => m.NotificationModule)
  },
  {
    path: 'verify/:id/:token',
    loadChildren: () =>
      import('@modules/features/common/verify-account/verify-account.module').then(m => m.VerifyAccountModule)
  },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonRoutingModule { }
