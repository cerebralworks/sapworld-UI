import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobDetailViewComponent } from './job-detail-view.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from '@shared/material.module';

const routes: Routes = [
  {
    path: '',
    component: JobDetailViewComponent
  }
];

@NgModule({
  declarations: [JobDetailViewComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class JobDetailViewModule { }
