import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, Injector, ErrorHandler, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';

@Injectable()
export class ErrorsHandler extends ErrorHandler {

  constructor(@Inject(Injector) private injector: Injector) {
    super();
  }

  private get toastrService(): ToastrService {
    return this.injector.get(ToastrService);
  }

  private get router(): Router {
    return this.injector.get(Router);
  }

  handleError(error: Error | HttpErrorResponse) {
    if (error instanceof HttpErrorResponse) {
      // Server or connection error happened
      if (!navigator.onLine) {
        // Handle offline error
        return this.toastrService.error("No Internet Connection");
      } else {
        // Handle Http Error (error.status === 403, 404...)
        return this.toastrService.error(`${error.status} - ${error.message}`);
      }
    } else {
      // Handle Client Error (Angular Error, ReferenceError...)
      this.router.navigate(["/error"], { queryParams: { error: error } });
    }

    // Log the error anyway
    super.handleError(error);
    console.error("It happens: ", error);
    return throwError(error);
  }
}
