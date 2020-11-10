import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'user',
    loadChildren: () =>
      import('@modules/auth/user-auth/user-auth.module').then(m => m.UserAuthModule)
  },
  {
    path: 'employer',
    loadChildren: () =>
      import('@modules/auth/employer-auth/employer-auth.module').then(m => m.EmployerAuthModule)
  },
  {
    path: 'agency',
    loadChildren: () =>
      import('@modules/auth/agency-auth/agency-auth.module').then(m => m.AgencyAuthModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
