import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WorkAuthorizationComponent } from './workauthorization.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from "angular-datatables";


@NgModule({
  declarations: [WorkAuthorizationComponent],
  imports: [
    CommonModule,ReactiveFormsModule,
    FormsModule,HttpClientModule,DataTablesModule,
    RouterModule.forChild([
      {
        path: '',
        component: WorkAuthorizationComponent,
      },
    ])
  ],
})
export class WorkAuthorizationModule {}
