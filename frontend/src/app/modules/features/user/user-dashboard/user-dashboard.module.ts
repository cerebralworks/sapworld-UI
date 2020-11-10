import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDashboardComponent } from './user-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { MatchingJobComponent } from '../matching-job/matching-job.component';
import { AppliedJobComponent } from '../applied-job/applied-job.component';
import { ShortlistedJobComponent } from '../shortlisted-job/shortlisted-job.component';
import { UserProfileComponent } from '../profile/user-profile/user-profile.component';
import { UserResumeComponent } from '../user-resume/user-resume.component';
import { UserSettingModule } from '../profile/user-setting/user-setting.module';
import { UserSharedModuleModule } from '../user-shared-module/user-shared-module.module';
import { VisaSponsoredComponent } from '../visa-sponsored/visa-sponsored.component';

const routes: Routes = [
  {
    path: '',
    component: UserDashboardComponent
  }
];

@NgModule({
  declarations: [
    UserDashboardComponent,
    MatchingJobComponent,
    AppliedJobComponent,
    ShortlistedJobComponent,
    UserProfileComponent,
    UserResumeComponent,
    VisaSponsoredComponent
  ],
  imports: [
    CommonModule,
    UserSharedModuleModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule, UserSharedModuleModule]
})
export class UserDashboardModule { }
