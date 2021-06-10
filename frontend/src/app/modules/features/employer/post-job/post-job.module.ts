import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PostJobLayoutComponent } from './post-job-layout/post-job-layout.component';
import { PostJobHeaderComponent } from './post-job-header/post-job-header.component';
import { PostJobFooterComponent } from './post-job-footer/post-job-footer.component';
import { JobInformationComponent } from './job-information/job-information.component';
import { OtherPreferenceComponent } from './other-preference/other-preference.component';
import { RequirementCriteriaComponent } from './requirement-criteria/requirement-criteria.component';
import { JobPreviewComponent } from './modal/job-preview/job-preview.component';
import { SharedModule } from '@shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '@shared/material.module';

const routes: Routes = [
  {
    path: '',
    component: PostJobLayoutComponent
  }
];

@NgModule({
  declarations: [
    PostJobLayoutComponent,
    PostJobLayoutComponent,
    PostJobHeaderComponent,
    PostJobFooterComponent,
    JobInformationComponent,
    OtherPreferenceComponent,
    RequirementCriteriaComponent,
    JobPreviewComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgbModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: [RouterModule]
})
export class PostJobModule { }
