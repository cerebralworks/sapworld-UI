import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PostJobLayoutComponent } from './post-job-layout/post-job-layout.component';
import { PostJobHeaderComponent } from './post-job-header/post-job-header.component';
import { PostJobFooterComponent } from './post-job-footer/post-job-footer.component';
import { JobInformationComponent } from './job-information/job-information.component';
import { OtherPreferenceComponent } from './other-preference/other-preference.component';
import { ScreeningProcessComponent } from './screening-process/screening-process.component';
import { RequirementCriteriaComponent } from './requirement-criteria/requirement-criteria.component';
import { JobPreviewComponent } from './modal/job-preview/job-preview.component';
import { SharedModule } from '@shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '@shared/material.module';
//import { AmazingTimePickerModule } from 'amazing-time-picker';

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
    ScreeningProcessComponent,
    JobPreviewComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgbModule,
    RouterModule.forChild(routes),
    SharedModule
	//AmazingTimePickerModule 
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  exports: [RouterModule]
})
export class PostJobModule { }
