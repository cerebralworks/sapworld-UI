import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateAdminProfileComponent } from './create-admin-profile.component';
import { RouterModule, Routes } from '@angular/router';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

const routes: Routes = [
  {
    path: '',
    component: CreateAdminProfileComponent
  }
];

@NgModule({
  declarations: [CreateAdminProfileComponent],
  imports: [
    CommonModule,
    NgxIntlTelInputModule,
    RouterModule.forChild(routes)
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
})
export class CreateAdminProfileModule { }
