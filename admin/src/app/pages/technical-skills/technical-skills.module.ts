import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TechnicalSkillsComponent } from './technical-skills.component';
import { OwlModule } from 'ngx-owl-carousel';  

@NgModule({
  declarations: [TechnicalSkillsComponent],
  imports: [
    CommonModule,OwlModule,
    RouterModule.forChild([
      {
        path: '',
        component: TechnicalSkillsComponent,
      },
    ]),
  ],
})
export class TechnicalSkillsModule {}
