import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentComponent } from './content/content.component';

const routes: Routes = [
  {
    path: '',
    component: ContentComponent,
    canActivate: [],
    children: [
      {
        path: 'auth',
        loadChildren: () =>
          import('@modules/auth/auth.module').then(m => m.AuthModule)
      },
      {
        path: '',
        loadChildren: () =>
          import('@modules/features/features.module.ts').then(m => m.FeaturesModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
