import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateMultipleJobMatchesComponent } from './candidate-multiple-job-matches.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: CandidateMultipleJobMatchesComponent
  }
];

@NgModule({
  declarations: [
    CandidateMultipleJobMatchesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CandidateMultipleJobMatchesModule { }
