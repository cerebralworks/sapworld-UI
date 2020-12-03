import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { FindCandidatesComponent } from './find-candidates.component';

const routes: Routes = [
  {
    path: '',
    component: FindCandidatesComponent
  }
];

@NgModule({
  declarations: [FindCandidatesComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class FindCandidatesModule { }
