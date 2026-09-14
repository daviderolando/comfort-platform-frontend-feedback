import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpParams,
} from '@angular/common/http';
import { take, exhaustMap } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Minimal implementation
    // console.log('Http request is about to be sent')
    // console.log(req)
    // return next.handle(req);

    // Resctrict interceptor action
    // req.url

    return this.authService.getSessionToken().pipe(
      take(1),
      exhaustMap((token)=> {
        if (!token) {
          return next.handle(req);
        }

        // console.log("🚀 ~ file: auth-interceptor.service.ts ~ line 29 ~ AuthInterceptorService ~ exhaustMap ~ token", token)
        // let headers = req.headers.append('Content-Type', 'application/json');
        let headers = req.headers.append('Authorization', token);
        const modifiedReq = req.clone({
            // params: new HttpParams().set('Authorization', 'Bearer ' + user.token),
            // params: new HttpParams().set('token', user.token),
            headers: headers,
          });
        return next.handle(modifiedReq);
        // return next.handle(req);
      })
    );

  }
}
