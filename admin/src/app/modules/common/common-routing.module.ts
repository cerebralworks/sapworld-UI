import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndustriesComponent } from './industries/industries.component';

const routes: Routes = [
  {
    path: 'list',
    component: IndustriesComponent
  },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: '**', redirectTo: 'list', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonRoutingModule { }
