import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostedJobComponent } from './posted-job.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from "angular-datatables";

@NgModule({
  declarations: [PostedJobComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    DataTablesModule,
    RouterModule.forChild([
      {
        path: '',
        component: PostedJobComponent,
      },
    ])
  ]
})
export class PostedJobModule { }
