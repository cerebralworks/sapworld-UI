import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileSettingComponent } from '../profile/user-setting/profile-setting/user-profile-setting.component';
import { SharedModule } from '@shared/shared.module';
import { ResumeSelectComponent } from '../modal/resume-select/resume-select.component';



@NgModule({
  declarations: [
    UserProfileSettingComponent,
    ResumeSelectComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [UserProfileSettingComponent, SharedModule, ResumeSelectComponent]
})
export class UserSharedModuleModule { }
