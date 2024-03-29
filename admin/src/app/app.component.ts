import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TranslationService } from './modules/i18n/translation.service';
// language list
import { locale as enLang } from './modules/i18n/vocabs/en';
import { locale as chLang } from './modules/i18n/vocabs/ch';
import { locale as esLang } from './modules/i18n/vocabs/es';
import { locale as jpLang } from './modules/i18n/vocabs/jp';
import { locale as deLang } from './modules/i18n/vocabs/de';
import { locale as frLang } from './modules/i18n/vocabs/fr';
// import { SplashScreenService } from './_metronic/partials/layout/splash-screen/splash-screen.service';
import { Router, NavigationEnd, NavigationError, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { SplashScreenService } from '@partials/layout/splash-screen/splash-screen.service';
import { TableExtendedService } from '@shared/services/table.extended.service';
import { AccountService } from '@data/service/account.service';
import { LoggedIn } from '@data/schema/account';
// import { TableExtendedService } from './shared';
// import { TableExtendedService } from '@shared/crud-table';
// import { TableExtendedService } from './_metronic/shared/crud-table';
import { ActivatedRoute, Event } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  public loggedInResponse: LoggedIn;
  public loaderEnabled: boolean = false;

  constructor(
    private translationService: TranslationService,
    private splashScreenService: SplashScreenService,
    private router: Router,
    private tableService: TableExtendedService,
    private ngxService: NgxUiLoaderService,
    private accountService: AccountService
  ) {
    // register translations
    this.translationService.loadTranslations(
      enLang,
      chLang,
      esLang,
      jpLang,
      deLang,
      frLang
    );
  }

  ngOnInit() {
    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.checkUserLoggedIn();
      }
	  
      if (event instanceof NavigationEnd) {
		  
		  if(event.url == '/home') {
        this.loaderEnabled = false;
       }else {
        this.loaderEnabled = true;
       }
	   
        // clear filtration paginations and others
        this.tableService.setDefaults();
        // hide splash screen
        this.splashScreenService.hide();

        // scroll to top on every route change
        window.scrollTo(0, 0);

        // to display back the body content
        setTimeout(() => {
          document.body.classList.add('page-loaded');
        }, 500);
      }
    });
    this.unsubscribe.push(routerSubscription);
  }

  checkUserLoggedIn = () => {
    this.accountService.checkUserloggedIn().subscribe(
      response => {
        this.loggedInResponse = response;
        if(this.loggedInResponse && (this.loggedInResponse.isLoggedIn == false)) {
          // this.validateCall = 0;
        }
        // this.getUserInfo();
      },
      error => {
      }
    );
  };

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
