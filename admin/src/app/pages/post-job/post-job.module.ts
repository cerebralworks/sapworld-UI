import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostJobLayoutComponent } from './post-job-layout/post-job-layout.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
const routes: Routes = [
  {
    path: '',
    component: PostJobLayoutComponent
  }
];

@NgModule({
  declarations: [PostJobLayoutComponent],
  imports: [
    CommonModule,
	 RouterModule.forChild(routes),
    SharedModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  exports: [RouterModule]
})
export class PostJobModule { }
