import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class HttpInterceptorInterceptor implements HttpInterceptor {
  constructor(private route: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // INTERCEPTOR NE GLOBALLY USE KARVA - TENE APP.MODULE MA PROVIDER MA SET KARVU IMPORTANT
    // MANUALLY ADDED.................
    console.warn('Interceptor Invoked...');

    if (!window.navigator.onLine) {
      return next.handle(request.clone({}));
    }

    // USER LOGIN PACHI - TOKEN (DATA) NE STORE KARVA .......
    let currentUserTemp: any = sessionStorage.getItem('_cu');
    let currentUser: any = JSON.parse(currentUserTemp);
    // console.log('Token', currentUser);
    // -------------------------------------------------------

    // CONDITIONALLY BASED - SET HEADER
    if (
      request.url.includes('admin/users') ||
      request.url.includes('transaction/1') ||
      request.url.includes('user/update') ||
      request.url.includes('admin/support-requests') ||
      request.url.includes('admin/transactions') ||
      request.url.includes('admin/dashboard_counts') ||
      request.url.includes('admin/car-papers') ||
      request.url.includes('delete_user') ||
      request.url.includes('supportRequest') ||
      request.url.includes('logout')
    ) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.data.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
    } else {
      request = request.clone({
        setHeaders: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
    }

    return next.handle(request);
  }
}
