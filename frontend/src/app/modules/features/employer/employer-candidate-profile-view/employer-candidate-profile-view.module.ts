import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { EmployerCandidateProfileViewComponent } from './employer-candidate-profile-view.component';
import { MaterialModule } from '@shared/material.module';

const routes: Routes = [
  {
    path: '',
    component: EmployerCandidateProfileViewComponent
  }
];

@NgModule({
  declarations: [EmployerCandidateProfileViewComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class EmployerCandidateProfileViewModule { }
