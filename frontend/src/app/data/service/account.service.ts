import { Injectable } from '@angular/core';
import { CacheService } from '@shared/service/cache.service';
import { BehaviorSubject, ReplaySubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import {
  AccountLogin,
  LoggedIn,
  AccountSignup,
  VerifyAccount
} from '@data/schema/account';
import { ApiService } from '@shared/service/api.service';


@Injectable({
  providedIn: 'root'
})
export class AccountService extends CacheService {
  public currentUserSubject: BehaviorSubject<
    AccountLogin
  > = new BehaviorSubject<AccountLogin>(this.hasCurrentUser());

  isLoginSubject = new BehaviorSubject<boolean>(this.hasIsLoggedIn());
  private loginCredientials: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private apiService: ApiService) {
    super();
  }
	
  /**
   * To Save the user profile details
   */
  saveLoginCredientials(details) {
    this.loginCredientials.next(details);
  }

   /**
   * To Get the user profile details
   */
  getLoginCredientials() {
    return this.loginCredientials.asObservable();
  }
  
  /**
   * It's return current user value as string
   */
  public get currentUserValue(): AccountLogin {
    return this.currentUserSubject.value;
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

  /**
   * To get the user is login or not
   */
  checkUserloggedIn = (): Observable<LoggedIn> => {
    return this.apiService.post('/api/isLoggedIn').pipe(
      map(data => {
        this.setAuth(data);
        this.saveLoginCredientials(data);
        return data;
      })
    );
  };
  
  /**
   * To login the existing user
   */
  login = (userCredentials: {}): Observable<LoggedIn> => {
    return this.apiService.post('/api/login', userCredentials).pipe(
      map(data => {
        this.setAuth(data);
        return data;
      })
    );
  };
   /**
   * To Signup the employer 
   */
  employerSignup = (userInfo: {}): Observable<AccountSignup> => {
    return this.apiService.post('/api/employers/signup', userInfo).pipe(
      map(data => {
        this.setAuth(data);
        return data;
      })
    );
  };
  
  /**
   * To Signup the user
   */
  userSignup = (userInfo: {}): Observable<AccountSignup> => {
    return this.apiService.post('/api/users/signup', userInfo).pipe(
      map(data => {
        this.setAuth(data);
        return data;
      })
    );
  };
  
  
  /**
   * To delete user account
   */
  userDeleteAccount = (requestParams: any): Observable<any> => {
    return this.apiService.post('/api/users/delete-account', requestParams).pipe(
      map(data => {
        return data;
      })
    );
  };
  
  /** To verify OTP **/
  verifyOtp = (requestParams: any): Observable<any> => {
    return this.apiService.post('/api/accounts/verify-otp', requestParams).pipe(
      map(data => {
        return data;
      })
    );
  };
  
  /** To sent OTP **/
  sendOtp = (requestParams: any): Observable<any> => {
    return this.apiService.post('/api/accounts/send-otp', requestParams).pipe(
      map(data => {
        return data;
      })
    );
  };
  /**
   * To Signup the user after send invite link
   */
  userSignupInviteUrl = (userInfo,path) => {
    return this.apiService.create(path, userInfo).pipe(
      map(data => {
        return data;
      })
    );
  };
  
  /**
   * To get Calendly User Details
   */
  userCalendlyDetailsGet = (userInfo,path) => {
    return this.apiService.getCalendlyUserDetails(path, userInfo).pipe(
      map(data => {
        return data;
      })
    );
  };
  
  /**
   * To get Calendly User Details
   */
  userCalendlyDetailsEventGet = (userInfo,path) => {
    return this.apiService.getEventsUser(path, userInfo).pipe(
      map(data => {
        return data;
      })
    );
  };
   
   /**
   * To request to reset the user password
   */
  getResetLink = (requestParams: any): Observable<any> => {
    return this.apiService.post('/api/accounts/request-reset-password', requestParams).pipe(
      map(data => {
        return data;
      })
    );
  };
  
  /**
   * To reset the user password
   */
  resetPassword = (requestParams: any): Observable<any> => {
    return this.apiService.post('/api/accounts/reset-password', requestParams).pipe(
      map(data => {
        return data;
      })
    );
  };

   /**
   * To update the user password
   */
   
  changePassword = (requestParams: any): Observable<any> => {
    return this.apiService.post('/api/accounts/update-password', requestParams).pipe(
      map(data => {
        return data;
      })
    );
  };

   /**
   * To verify the user account
   */
  verify = (userCredentials: VerifyAccount): Observable<VerifyAccount> => {
    return this.apiService.post('/api/accounts/verify', userCredentials).pipe(
      map(data => {
        return data;
      })
    );
  };

  /**
   * To logout the user
   */
  logout = () => {
    return this.apiService.post('/api/logout').pipe(
      map(data => {
        this.setAuth(data);
        return data;
      })
    );
    // remove user from local storage to log user out
  };

   /**
   * To set the authentication of the user
   */
   
  setAuth(data: LoggedIn) {
    // Save logged in and sent from server in localstorage
    this.setItem('currentUser', data);
    // Set current user data into observable
    this.changeCurrentUserValue(data);
    // Set isAuthenticated to true
    const isLoggedIn = data.isLoggedIn ? true : false;
    this.isLoginSubject.next(isLoggedIn);
  }

  /**
   * To empty the authenticated user
   */
   
  purgeAuth() {
    // Remove logged in and sent from server in localstorage
    this.removeItem('currentUser');
    // Set current user to an empty object
    this.currentUserSubject.next({} as AccountLogin);
    // Set auth status to false
    this.isLoginSubject.next(false);
  }
}
