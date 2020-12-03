import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { EmployerCandidateMultipleProfileMatchesComponent } from './employer-candidate-multiple-profile-matches.component';
import { SharedModule } from '@shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: EmployerCandidateMultipleProfileMatchesComponent
  }
];

@NgModule({
  declarations: [EmployerCandidateMultipleProfileMatchesComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class EmployerCandidateMultipleProfileMatchesModule { }
