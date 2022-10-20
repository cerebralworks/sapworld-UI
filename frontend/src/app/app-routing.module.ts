import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from './layout/layout.module';

const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
    scrollPositionRestoration: "enabled",
	anchorScrolling: 'enabled',
    useHash: false,
    relativeLinkResolution: 'legacy'
}),
    LayoutModule
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
