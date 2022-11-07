import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { SocialShareComponent } from './social-share.component';

const routes: Routes = [
  {
    path: '',
    component: SocialShareComponent
  }
]; 
@NgModule({
  declarations: [
  SocialShareComponent
  ],
  imports: [
    CommonModule,
	 SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class SocialShareModule { }
