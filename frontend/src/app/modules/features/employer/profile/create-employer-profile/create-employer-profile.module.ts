import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateEmployerProfileComponent } from './create-employer-profile.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: CreateEmployerProfileComponent
  }
];

@NgModule({
  declarations: [CreateEmployerProfileComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class CreateEmployerProfileModule { }
