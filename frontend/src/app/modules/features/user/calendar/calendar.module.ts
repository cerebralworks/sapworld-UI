import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { ScheduleModule, View } from '@syncfusion/ej2-angular-schedule';
import { WeekService, MonthService} from '@syncfusion/ej2-angular-schedule';

const routes: Routes = [
  {
    path: '',
    component: CalendarComponent
  }
];

@NgModule({
  declarations: [CalendarComponent],
  imports: [
    CommonModule,
    SharedModule,
    ScheduleModule,
    RouterModule.forChild(routes)
  ],
   providers: [WeekService,MonthService]
})
export class CalendarModule { }
