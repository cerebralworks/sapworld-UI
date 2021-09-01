import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployerListComponent } from './employer-list/employer-list.component';
import { EmployerViewComponent } from './employer-view/employer-view.component';

const routes: Routes = [
  {
    path: 'list',
    component: EmployerListComponent
  },
  {
    path: 'view/:id',
    component: EmployerViewComponent
  },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: '**', redirectTo: 'list', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployerRoutingModule { }
