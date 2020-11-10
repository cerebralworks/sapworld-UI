import { InjectionToken } from '@angular/core';

export let APP_CONFIG = new InjectionToken('app.config');

export const AppConfig: any = {
  agencyRoutes: {
    login: 'agency/login',
  },
  userRoutes: {
    login: 'user/login',
  },
  employerRoutes: {
    login: 'employer/login',
  },
  commonRoutes: {
    emptyRoute: '',
    home: 'home',
    error: 'error',
    unauthorized: 'unauthorized',
    contactUs: 'contact-us',
    faq: 'faq',
    aboutUs: 'about-us',
    privacypolicy: 'privacy-policy',
    termsofuse: 'terms-of-use',
    forgetPassword: 'forget-password'
  },
  snackBarDuration: 3000,
  repositoryURL: 'https://gitlab.com/studioqdotin/sapworld-frontend.git'
};
