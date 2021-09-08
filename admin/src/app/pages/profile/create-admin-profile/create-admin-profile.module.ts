import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateAdminProfileComponent } from './create-admin-profile.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';


@NgModule({
  declarations: [CreateAdminProfileComponent],
  imports: [
    CommonModule,
    NgxIntlTelInputModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: CreateAdminProfileComponent,
      },
    ])
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
})
export class CreateAdminProfileModule { }
