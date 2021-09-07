import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSettingComponent } from './admin-setting.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AdminSettingComponent
  }
];

@NgModule({
  declarations: [AdminSettingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminSettingModule { }
