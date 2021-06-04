import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { CreateCandidateLayoutComponent } from './create-candidate-layout/create-candidate-layout.component';
import { CreateCandidateHeaderComponent } from './create-candidate-header/create-candidate-header.component';
import { CreateCandidateFooterComponent } from './create-candidate-footer/create-candidate-footer.component';
import { CreateCandidatePersonalDetailsComponent } from './create-candidate-personal-details/create-candidate-personal-details.component';
import { CreateCandidateEducationExpComponent } from './create-candidate-education-exp/create-candidate-education-exp.component';
import { CreateCandidateSkillsetComponent } from './create-candidate-skillset/create-candidate-skillset.component';
import { CreateCandidateJobPreferenceComponent } from './create-candidate-job-preference/create-candidate-job-preference.component';
import { CandidateReviewModalComponent } from './candidate-review-modal/candidate-review-modal.component';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
const routes: Routes = [
  {
    path: '',
    component: CreateCandidateLayoutComponent
  }
];

@NgModule({
  declarations: [
    // CreateCandidateComponent,
    CreateCandidateLayoutComponent,
    CreateCandidateHeaderComponent,
    CreateCandidateFooterComponent,
    CreateCandidatePersonalDetailsComponent,
    CreateCandidateEducationExpComponent,
    CreateCandidateSkillsetComponent,
    CreateCandidateJobPreferenceComponent,
    CandidateReviewModalComponent],
  imports: [
    NgbModule,
    CommonModule,
    SharedModule,
    NgxIntlTelInputModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CreateCandidateModule { }
