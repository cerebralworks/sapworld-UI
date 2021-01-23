import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CandidateJobViewComponent } from './candidate-job-view.component';
import { SharedModule } from '@shared/shared.module';



const routes: Routes = [
  {
    path: '',
    component: CandidateJobViewComponent
  }
];

@NgModule({
  declarations: [CandidateJobViewComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CandidateJobViewModule { }
