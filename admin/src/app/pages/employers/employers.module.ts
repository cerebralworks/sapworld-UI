import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmployersComponent } from './employers.component';
import { EmployerViewComponent } from './employer-view/employer-view.component';
import { OwlModule } from 'ngx-owl-carousel';  
import { DataTablesModule } from "angular-datatables";

@NgModule({
  declarations: [EmployerViewComponent,EmployersComponent],
  imports: [
    CommonModule,OwlModule,DataTablesModule,
    RouterModule.forChild([
      {
        path: '',
        component: EmployersComponent,
      },{
        path: 'view/:id',
		component: EmployerViewComponent,
      },
    ]),
  ],
})
export class EmployersModule {}
