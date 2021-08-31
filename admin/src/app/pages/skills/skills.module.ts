import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SkillsComponent } from './skills.component';

@NgModule({
  declarations: [SkillsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: SkillsComponent,
      },
    ])
  ],
})
export class SkillsModule {}
