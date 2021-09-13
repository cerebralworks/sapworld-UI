import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { transformError } from '@app/interceptor/http-error';
import { environment as env } from '@env';

@Injectable()
export class ApiService {
  constructor(
    private http: HttpClient,
  ) { }

  private formatErrors(error: any) {
    if (error instanceof HttpErrorResponse) {
      // const errorMessages = new Array<{ propName: string; errors: string }>();
      console.log(error);

      return throwError(error.error);
    }

  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${env.serverUrl}${path}`, { params, withCredentials: true })
      .pipe(catchError(this.formatErrors));
  }
  
  delete(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.delete(`${env.serverUrl}${path}`, { params, withCredentials: true })
      .pipe(catchError(this.formatErrors));
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(
      `${env.serverUrl}${path}`,
      JSON.stringify(body)
    ).pipe(catchError(this.formatErrors));
  }

  post(path: string, body: Object = {}, headers: HttpHeaders = new HttpHeaders()): Observable<any> {
    return this.http.post(
      `${env.serverUrl}${path}`,
      body, ({ headers, withCredentials: true })
    ).pipe(catchError(this.formatErrors));
  }

  /* delete(path): Observable<any> {
    return this.http.delete(
      `${env.serverUrl}${path}`
    ).pipe(catchError(this.formatErrors));
  } */
}
