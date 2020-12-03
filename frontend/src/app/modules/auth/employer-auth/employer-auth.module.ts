import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployerAuthRoutingModule } from './employer-auth-routing.module';

import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    EmployerAuthRoutingModule
  ]
})
export class EmployerAuthModule { }
