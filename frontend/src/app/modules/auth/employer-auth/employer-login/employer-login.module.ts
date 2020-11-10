import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { EmployerLoginComponent } from './employer-login.component';

const routes: Routes = [
  {
    path: '',
    component: EmployerLoginComponent
  }
];

@NgModule({
  declarations: [EmployerLoginComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class EmployerLoginModule { }
