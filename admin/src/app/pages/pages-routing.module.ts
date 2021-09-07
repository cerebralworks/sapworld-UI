import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './_layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },{
        path: 'employers',
        loadChildren: () =>
          import('./employers/employers.module').then((m) => m.EmployersModule),
      },{
        path: 'jobseeker',
        loadChildren: () =>
          import('./jobseeker/jobseeker.module').then((m) => m.JobSeekerModule),
      },{ 
        path: 'skills',
        loadChildren: () =>
          import('./skills/skills.module').then((m) => m.SkillsModule),
      },{
        path: 'industry',
        loadChildren: () =>
          import('./industry/industry.module').then((m) => m.IndustryModule),
      },{
        path: 'workauthorization',
        loadChildren: () =>
          import('./workauthorization/workauthorization.module').then((m) => m.WorkAuthorizationModule),
      },{
        path: 'technical-skills',
        loadChildren: () =>
          import('./technical-skills/technical-skills.module').then((m) => m.TechnicalSkillsModule),
      },{
        path: 'profile-settings',
        loadChildren: () =>
          import('./profile/admin-setting/admin-setting.module').then((m) => m.AdminSettingModule),
      },{
        path: 'profile-view',
        loadChildren: () =>
          import('./profile/admin-profile/admin-profile.module').then((m) => m.AdminProfileModule),
      },{
        path: 'profile-edit',
        loadChildren: () =>
          import('./profile/create-admin-profile/create-admin-profile.module').then((m) => m.CreateAdminProfileModule),
      },{
        path: 'employer',
        loadChildren: () =>
          import('../modules/employer/employer.module').then(
            (m) => m.EmployerModule
          ),
      },
      {
        path: 'user',
        loadChildren: () =>
          import('../modules/job-seeker/job-seeker.module').then(
            (m) => m.JobSeekerModule
          ),
      },
      {
        path: 'common',
        loadChildren: () =>
          import('../modules/common/common.module').then(
            (m) => m.CommonSharedModule
          ),
      },
      {
        path: 'user-profile',
        loadChildren: () =>
          import('../modules/user-profile/user-profile.module').then(
            (m) => m.UserProfileModule
          ),
      },
      {
        path: 'ngbootstrap',
        loadChildren: () =>
          import('../modules/ngbootstrap/ngbootstrap.module').then(
            (m) => m.NgbootstrapModule
          ),
      },
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'error/404',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
