import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'user',
    loadChildren: () =>
      import('@modules/features/user/user.module').then(m => m.UserModule)
  },
  {
    path: 'employer',
    loadChildren: () =>
      import('@modules/features/employer/employer.module').then(m => m.EmployerModule)
  },
  {
    path: 'agency',
    loadChildren: () =>
      import('@modules/features/agency/agency.module').then(m => m.AgencyModule)
  },
  {
    path: '',
    loadChildren: () =>
      import('@modules/features/common/common.module').then(m => m.CommonFeatureModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturesRoutingModule { }
