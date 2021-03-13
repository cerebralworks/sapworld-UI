import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployerRoutingModule } from './employer-routing.module';
import { EmployerListComponent } from './employer-list/employer-list.component';
import { SharedModule } from '@shared/shared.module';
import { EmployerViewComponent } from './employer-view/employer-view.component';


@NgModule({
  declarations: [EmployerListComponent, EmployerViewComponent],
  imports: [
    CommonModule,
    EmployerRoutingModule,
    SharedModule
  ]
})
export class EmployerModule { }
