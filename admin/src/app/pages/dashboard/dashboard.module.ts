import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardsModule } from '@partials/content/dashboards/dashboards.module';
import { DashboardComponent } from './dashboard.component';
import { DataTablesModule } from "angular-datatables"; 

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
      },
    ]),
    DashboardsModule,
  ],
})
export class DashboardModule {}
