import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IndustryComponent } from './industry.component';

@NgModule({
  declarations: [IndustryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: IndustryComponent,
      },
    ])
  ],
})
export class IndustryModule {}
