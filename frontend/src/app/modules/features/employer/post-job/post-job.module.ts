import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PostJobLayoutComponent } from './post-job-layout/post-job-layout.component';
import { PostJobHeaderComponent } from './post-job-header/post-job-header.component';
import { PostJobFooterComponent } from './post-job-footer/post-job-footer.component';
import { JobInformationComponent } from './job-information/job-information.component';
import { RequirementCriteriaComponent } from './requirement-criteria/requirement-criteria.component';
import { JobPreviewComponent } from './modal/job-preview/job-preview.component';
import { SharedModule } from '@shared/shared.module';

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
    RequirementCriteriaComponent,
    JobPreviewComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: [RouterModule]
})
export class PostJobModule { }
