import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { PrivacyPolicyComponent } from './privacy-policy.component';

const routes: Routes = [
  {
    path: '',
    component: PrivacyPolicyComponent
  }
]; 
@NgModule({
  declarations: [
  PrivacyPolicyComponent
  ],
  imports: [
    CommonModule,
	 SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class PrivacyPolicyModule { }
