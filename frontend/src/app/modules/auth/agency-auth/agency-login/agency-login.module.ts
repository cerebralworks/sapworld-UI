import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { AgencyLoginComponent } from './agency-login.component';

const routes: Routes = [
  {
    path: '',
    component: AgencyLoginComponent
  }
];

@NgModule({
  declarations: [AgencyLoginComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class AgencyLoginModule { }
