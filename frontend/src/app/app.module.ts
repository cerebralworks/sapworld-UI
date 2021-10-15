import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from '@shared/shared.module';
import { ConfigModule } from '@config/config.module';
import { CoreModule } from '@app/core.module';
import { NgbModule  } from '@ng-bootstrap/ng-bootstrap';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AccountService } from '@data/service/account.service';
import { NgxUiLoaderHttpModule, NgxUiLoaderModule } from 'ngx-ui-loader';
import { environment } from '@env';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // angular
    BrowserModule,
    BrowserAnimationsModule,
    // HttpClientModule,
	ChartsModule,
    // app
    AppRoutingModule,

    // core & shared
    CoreModule,
    SharedModule,

    // config
    ConfigModule,

    // Plugin
    NgbModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgxUiLoaderModule, // import NgxUiLoaderModule
    // NgxUiLoaderHttpModule,
	TooltipModule.forRoot(),
    NgxUiLoaderHttpModule.forRoot({
      showForeground: true,
      exclude: [
        environment.serverUrl + "/api/isLoggedIn",
        environment.serverUrl + "/api/notification/count",
        environment.serverUrl + "/api/jobpostings/job-scoring",
        environment.serverUrl + "/api/jobpostings/user-scoring",
        environment.clientUrl + "/assets/i18n/en.json",
      ],
    })
  ],
  providers: [AccountService],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }


// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
