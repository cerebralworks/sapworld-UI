import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmployersComponent } from './employers.component';
import { EmployerViewComponent } from './employer-view/employer-view.component';
import { OwlModule } from 'ngx-owl-carousel';  
import { DataTablesModule } from "angular-datatables";
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
@NgModule({
  declarations: [EmployerViewComponent,EmployersComponent],
  imports: [
    CommonModule,OwlModule,DataTablesModule,ReactiveFormsModule,FormsModule,SharedModule,
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
  schemas: [ CUSTOM_ELEMENTS_SCHEMA]
})
export class EmployersModule {}
