import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { CalendarModule } from 'angular-calendar';
const routes: Routes = [
  {
    path: '',
    component: CalendarComponent
  }
];

@NgModule({
  declarations: [
    CalendarComponent
  ],
  imports: [
    CommonModule,
	SharedModule,CalendarModule,
	RouterModule.forChild(routes)
  ]
})
export class CalendarModules { }
