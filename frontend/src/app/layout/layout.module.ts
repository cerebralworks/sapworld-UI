import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ContentComponent } from './content/content.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    ContentComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    LayoutRoutingModule
  ],
  exports: [
    TranslateModule,
    HeaderComponent,
    FooterComponent
  ]
})
export class LayoutModule { }
