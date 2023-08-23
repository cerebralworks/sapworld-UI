import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA } from '@angular/core';

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
import { NgChartsModule } from 'ng2-charts';
import { NgxGpAutocompleteModule } from "@angular-magic/ngx-gp-autocomplete";
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // angular
    BrowserModule,
    BrowserAnimationsModule,
    // HttpClientModule,
	NgChartsModule,
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
	NgxGpAutocompleteModule.forRoot({ 
      loaderOptions: { 
            apiKey: 'AIzaSyAlNbHgwIyn7mVCKpkdie_uu8_a87A1fvc',
            libraries: ['places']
      } 
    }),
	CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
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
  schemas: [ CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }


// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json?v=' + new Date().getTime());
}
