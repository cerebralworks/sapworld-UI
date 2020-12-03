import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyAccountComponent } from './verify-account.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: VerifyAccountComponent
  }
];

@NgModule({
  declarations: [VerifyAccountComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class VerifyAccountModule { }
