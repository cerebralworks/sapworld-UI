import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateJobMatchesComponent } from './candidate-job-matches.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: CandidateJobMatchesComponent
  }
];

@NgModule({
  declarations: [CandidateJobMatchesComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CandidateJobMatchesModule { }
