import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WorkAuthorizationComponent } from './workauthorization.component';

@NgModule({
  declarations: [WorkAuthorizationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: WorkAuthorizationComponent,
      },
    ])
  ],
})
export class WorkAuthorizationModule {}
