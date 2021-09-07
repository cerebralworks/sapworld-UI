import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SkillsComponent } from './skills.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from "angular-datatables";

@NgModule({
  declarations: [SkillsComponent],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    DataTablesModule,
    RouterModule.forChild([
      {
        path: '',
        component: SkillsComponent,
      },
    ])
  ],
})
export class SkillsModule {}
