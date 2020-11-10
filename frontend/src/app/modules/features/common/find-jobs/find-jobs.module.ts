import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { FindJobsComponent } from './find-jobs.component';

const routes: Routes = [
  {
    path: '',
    component: FindJobsComponent
  }
];

@NgModule({
  declarations: [FindJobsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class FindJobsModule { }
