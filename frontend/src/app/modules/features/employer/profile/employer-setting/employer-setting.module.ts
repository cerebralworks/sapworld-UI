import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployerSettingComponent } from './employer-setting.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: EmployerSettingComponent
  }
];

@NgModule({
  declarations: [EmployerSettingComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class EmployerSettingModule { }
