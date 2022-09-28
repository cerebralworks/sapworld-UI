import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSettingComponent } from './admin-setting.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';

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
    RouterModule.forChild(routes),
	ReactiveFormsModule,
	FormsModule,
	SharedModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminSettingModule { }
