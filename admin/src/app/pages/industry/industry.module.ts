import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IndustryComponent } from './industry.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from "angular-datatables";

@NgModule({
  declarations: [IndustryComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    DataTablesModule,
    RouterModule.forChild([
      {
        path: '',
        component: IndustryComponent,
      },
    ])
  ],
})
export class IndustryModule {}
