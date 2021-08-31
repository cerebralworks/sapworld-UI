import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmployersComponent } from './employers.component';
import { OwlModule } from 'ngx-owl-carousel';  
import { DataTablesModule } from "angular-datatables";

@NgModule({
  declarations: [EmployersComponent],
  imports: [
    CommonModule,OwlModule,DataTablesModule,
    RouterModule.forChild([
      {
        path: '',
        component: EmployersComponent,
      },
    ]),
  ],
})
export class EmployersModule {}
