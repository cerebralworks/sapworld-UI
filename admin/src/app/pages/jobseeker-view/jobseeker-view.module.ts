import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from "angular-datatables";
import { JobseekerViewComponent } from './jobseeker-view.component';


@NgModule({
  declarations: [JobseekerViewComponent],
  imports: [
    CommonModule,
	ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    DataTablesModule,
    RouterModule.forChild([
      {
        path: '',
        component: JobseekerViewComponent,
      },
    ])
  ]
})
export class JobseekerViewModule { }
