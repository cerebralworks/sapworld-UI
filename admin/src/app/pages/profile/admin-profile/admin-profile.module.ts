import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminProfileComponent } from './admin-profile.component';

const routes: Routes = [
  {
    path: '',
    component: AdminProfileComponent
  }
];

@NgModule({
  declarations: [AdminProfileComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminProfileModule { }
