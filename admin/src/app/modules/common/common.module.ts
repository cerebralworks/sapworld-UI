import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonRoutingModule } from './common-routing.module';
import { IndustriesComponent } from './industries/industries.component';


@NgModule({
  declarations: [IndustriesComponent],
  imports: [
    CommonModule,
    CommonRoutingModule
  ]
})
export class CommonSharedModule { }
