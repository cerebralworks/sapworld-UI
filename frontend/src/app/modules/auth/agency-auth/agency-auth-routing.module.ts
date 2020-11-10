import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgencyLoginComponent } from './agency-login/agency-login.component';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('@modules/auth/agency-auth/agency-login/agency-login.module').then(m => m.AgencyLoginModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgencyAuthRoutingModule { }
