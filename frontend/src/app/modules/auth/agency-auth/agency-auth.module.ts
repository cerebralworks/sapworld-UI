import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgencyAuthRoutingModule } from './agency-auth-routing.module';

import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    AgencyAuthRoutingModule
  ]
})
export class AgencyAuthModule { }
