import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobSeekerRoutingModule } from './job-seeker-routing.module';
import { UserListComponent } from './user-list/user-list.component';


@NgModule({
  declarations: [UserListComponent],
  imports: [
    CommonModule,
    JobSeekerRoutingModule
  ]
})
export class JobSeekerModule { }
