import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { EmployerProfileComponent } from './employer-profile.component';

const routes: Routes = [
  {
    path: '',
    component: EmployerProfileComponent
  }
];

@NgModule({
  declarations: [EmployerProfileComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class EmployerProfileModule { }
