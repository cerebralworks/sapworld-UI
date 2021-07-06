import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployerDashboardComponent } from './employer-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { PostedJobComponent } from '../posted-job/posted-job.component';
import { EmployerCandidateMatchesComponent } from '../employer-candidate-matches/employer-candidate-matches.component';
import { EmployerAppliedCandidateComponent } from '../employer-applied-candidate/employer-applied-candidate.component';
import { EmployerShortlistedCandidateComponent } from '../employer-shortlisted-candidate/employer-shortlisted-candidate.component';
import { SharedModule } from '@shared/shared.module';
import { SavedProfileComponent } from '../saved-profile/saved-profile.component';
import { AddNotesComponent } from '../modal/add-notes/add-notes.component';
import { EmployerSubscriptionComponent } from '../modal/employer-subscription/employer-subscription.component';
import { MatchOtherPostComponent } from '../modal/match-other-post/match-other-post.component';
import { MaterialModule } from '@shared/material.module';

const routes: Routes = [
  {
    path: '',
    component: EmployerDashboardComponent
  }
];

@NgModule({
  declarations: [
    EmployerDashboardComponent,
    PostedJobComponent,
    EmployerCandidateMatchesComponent,
    EmployerAppliedCandidateComponent,
    EmployerShortlistedCandidateComponent,
    SavedProfileComponent,
    AddNotesComponent,
    EmployerSubscriptionComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule, AddNotesComponent, EmployerSubscriptionComponent]
})
export class EmployerDashboardModule { }
