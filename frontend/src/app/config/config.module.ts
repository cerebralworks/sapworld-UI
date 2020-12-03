import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppConfig, APP_CONFIG } from './app.config';
import { AppGlobals } from './app.global';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    AppGlobals,
    { provide: APP_CONFIG, useValue: AppConfig },
  ]
})
export class ConfigModule { }
