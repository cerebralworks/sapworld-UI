import { Injectable } from '@angular/core';
// import { CacheService } from '@shared/service/cache.service';
import { BehaviorSubject, ReplaySubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import {
  AccountLogin,
  LoggedIn,
  AccountSignup,
  VerifyAccount
} from '@data/schema/account';
import { ApiService } from '@shared/services/api.service';
// import { CacheService } from '@shared/services/cache.service';
import { Router } from '@angular/router';
import { CacheService } from '@shared/services/cache.service';
// import { ApiService } from '@shared/service/api.service';


@Injectable({
  providedIn: 'root'
})
export class AccountService extends CacheService {
  // public currentUserSubject: BehaviorSubject<
  //   AccountLogin
  // > = new BehaviorSubject<AccountLogin>(this.hasCurrentUser());

  currentUserSubject: BehaviorSubject<AccountLogin>;
  currentUser$: Observable<AccountLogin>;
  isLoginSubject = new BehaviorSubject<boolean>(this.hasIsLoggedIn());

  constructor(
    private apiService: ApiService,
    private router: Router
    ) {
    super();
    this.currentUserSubject = new BehaviorSubject<AccountLogin>(this.hasCurrentUser());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  /**
   * It's return current user value as string
   */
  get currentUserValue(): AccountLogin {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: AccountLogin) {
    this.currentUserSubject.next(user);
  }

  /**
   * change current userValue
   */
  public changeCurrentUserValue(data) {
    this.currentUserSubject.next(data);
  }

  /**
   * if we have token the user is loggedIn
   * @returns {boolean}
   */
  private hasIsLoggedIn(): boolean {
    const data: any = this.getItem('currentUser');
    if (data) {
      return !!data.isLoggedIn
    }
    return false;
  }

  /**
   * Get current value from local storage
   * @returns {any}
   */
  private hasCurrentUser(): any {
    return this.getItem('currentUser');
  }

  /**
   * It's return loggen in value
   * @returns {Observable<T>}
   */
  isLoggedIn(): Observable<boolean> {
    return this.isLoginSubject.asObservable().pipe(distinctUntilChanged());
  }

  /**
   * It's return current user value as Observable
   * @returns {Observable<T>}
   */
  isCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable().pipe(distinctUntilChanged());
  }


  checkUserloggedIn = (): Observable<LoggedIn> => {
    return this.apiService.post('/api/isLoggedIn').pipe(
      map(data => {
        this.setAuth(data);
        return data;
      })
    );
  };

  login = (userCredentials: {}): Observable<LoggedIn> => {
    return this.apiService.post('/api/login', userCredentials).pipe(
      map(data => {
        this.setAuth(data);
        return data;
      })
    );
  };

  logout() {
    this.logoutAPI().subscribe(
      response => {
        this.clear();
        this.router.navigate(['/auth/login'], {
          queryParams: {},
        });
      }
    )
  }

  employerSignup = (userInfo: {}): Observable<AccountSignup> => {
    return this.apiService.post('/api/employers/signup', userInfo).pipe(
      map(data => {
        this.setAuth(data);
        return data;
      })
    );
  };

  userSignup = (userInfo: {}): Observable<AccountSignup> => {
    return this.apiService.post('/api/users/signup', userInfo).pipe(
      map(data => {
        this.setAuth(data);
        return data;
      })
    );
  };

  getResetLink = (requestParams: any): Observable<any> => {
    return this.apiService.post('/api/accounts/request-reset-password', requestParams).pipe(
      map(data => {
        return data;
      })
    );
  };

  resetPassword = (requestParams: any): Observable<any> => {
    return this.apiService.post('/api/accounts/reset-password', requestParams).pipe(
      map(data => {
        return data;
      })
    );
  };

  changePassword = (requestParams: any): Observable<any> => {
    return this.apiService.post('/api/accounts/update-password', requestParams).pipe(
      map(data => {
        return data;
      })
    );
  };


  verify = (userCredentials: VerifyAccount): Observable<VerifyAccount> => {
    return this.apiService.post('/api/accounts/verify', userCredentials).pipe(
      map(data => {
        return data;
      })
    );
  };

  logoutAPI = () => {
    return this.apiService.post('/api/logout').pipe(
      map(data => {
        this.setAuth(data);
        return data;
      })
    );
    // remove user from local storage to log user out
  };

  setAuth(data: LoggedIn) {
    // Save logged in and sent from server in localstorage
    this.setItem('currentUser', data);
    // Set current user data into observable
    this.changeCurrentUserValue(data);
    // Set isAuthenticated to true
    const isLoggedIn = data.isLoggedIn ? true : false;
    this.isLoginSubject.next(isLoggedIn);
  }

  purgeAuth() {
    // Remove logged in and sent from server in localstorage
    this.removeItem('currentUser');
    // Set current user to an empty object
    this.currentUserSubject.next({} as AccountLogin);
    // Set auth status to false
    this.isLoginSubject.next(false);
  }
}
