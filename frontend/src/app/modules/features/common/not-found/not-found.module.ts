import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from '@shared/material.module';

const routes: Routes = [
  {
    path: '',
    component: NotFoundComponent
  }
];

@NgModule({
  declarations: [NotFoundComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ]
})
export class NotFoundModule { }
