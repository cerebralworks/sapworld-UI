import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { SettingLayoutComponent } from './setting-layout/setting-layout.component';
import { UserAccountSettingComponent } from './account-setting/user-account-setting.component';
import { UserSharedModuleModule } from '../../user-shared-module/user-shared-module.module';
import { UserLinksComponent } from './user-links/user-links.component';

const routes: Routes = [
  {
    path: '',
    component: SettingLayoutComponent
  }
];

@NgModule({
  declarations: [
    SettingLayoutComponent,
    UserAccountSettingComponent,
    UserLinksComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserSharedModuleModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule, UserSharedModuleModule, SharedModule]
})
export class UserSettingModule { }
