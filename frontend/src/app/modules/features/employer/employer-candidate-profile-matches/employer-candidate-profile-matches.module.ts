import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EmployerCandidateProfileMatchesComponent } from './employer-candidate-profile-matches.component';
import { SharedModule } from '@shared/shared.module';
import { MatchOtherPostComponent } from '../modal/match-other-post/match-other-post.component';

const routes: Routes = [
  {
    path: '',
    component: EmployerCandidateProfileMatchesComponent
  }
];

@NgModule({
  declarations: [EmployerCandidateProfileMatchesComponent, MatchOtherPostComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class EmployerCandidateProfileMatchesModule { }
