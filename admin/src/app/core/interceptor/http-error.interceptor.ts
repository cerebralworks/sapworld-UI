import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { Observable, of, EMPTY, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AccountService } from '@data/service/account.service';
import { Logger } from '@app/logger/logger.service';
import { environment } from '@env';

const log = new Logger('HttpErrorInterceptor');

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(@Inject(Injector) private injector: Injector) {
  }

  private get toastrService(): ToastrService {
    return this.injector.get(ToastrService);
  }

  private get accountService(): AccountService {
    return this.injector.get(AccountService);
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(evt => {
        if (evt instanceof HttpResponse) {
          const logout = /logout/gi;

          if (evt.body && evt.body.success && evt.body.message) {
            if (req.url.search(logout) === -1) {
              this.toastrService.success(
                evt.body.message,
                ''
              );
            }
          }
        }



      }),
      catchError((err: any) => {
        if (!environment.production) {
          // Do something with the error
          log.error('Request error', err);
        }
        const router = this.injector.get(Router);
        if ([401, 403].indexOf(err.status) !== -1) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          this.accountService.logout();
          location.reload();
        }
        if (err instanceof HttpErrorResponse) {
          try {

            if (!navigator.onLine) {
              // Handle offline error
              // this.toastrService.error('No Internet Connection', '');


            } else {
              const re = /company-profile/gi;
              if (req.url.search(re) === -1) {
                if (err.error.error.message) {
                  this.toastrService.error(err.error.error.message, '');
                } else if (err.error.err) {
                  this.toastrService.error(err.error.err.msg || err.error.err.message, '');
                }
              }
            }
          } catch (e) {
            this.toastrService.error('An error occurred', '');
          }
        } else {
          // Handle Client Error (Angular Error, ReferenceError...)
          router.navigate(['/error'], { queryParams: { error: err } });
        }
        return throwError(err);
      })
    );
  }
}
