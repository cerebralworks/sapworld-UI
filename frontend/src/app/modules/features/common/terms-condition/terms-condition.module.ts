import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { TermsConditionComponent } from './terms-condition.component';

const routes: Routes = [
  {
    path: '',
    component: TermsConditionComponent
  }
]; 

@NgModule({
  declarations: [
  TermsConditionComponent
  ],
  imports: [
   CommonModule,
	 SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class TermsConditionModule { }
