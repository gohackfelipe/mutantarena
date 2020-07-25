import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser && currentUser.idToken && currentUser.idToken.jwtToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.idToken.jwtToken}`
        }
      });
    }

    return next.handle(request);
  }
}
