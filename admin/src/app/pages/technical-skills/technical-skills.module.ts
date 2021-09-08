import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TechnicalSkillsComponent } from './technical-skills.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from "angular-datatables";


@NgModule({
  declarations: [TechnicalSkillsComponent],
  imports: [
    CommonModule,ReactiveFormsModule,
    FormsModule,HttpClientModule,DataTablesModule,
    RouterModule.forChild([
      {
        path: '',
        component: TechnicalSkillsComponent,
      },
    ]),
  ],
})
export class TechnicalSkillsModule {}
