import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,SharedModule,
    UserRoutingModule
  ],
  exports: []
})
export class UserModule { }
