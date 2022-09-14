import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobSeekerComponent } from './jobseeker.component';
import { OwlModule } from 'ngx-owl-carousel';  
import { DataTablesModule } from "angular-datatables";
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [JobSeekerComponent],
  imports: [
    CommonModule,OwlModule,DataTablesModule,ReactiveFormsModule,FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: JobSeekerComponent,
      },
    ])
  ],
})
export class JobSeekerModule {}
