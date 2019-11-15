import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';

import { AuthService } from './auth.service';

import { take, exhaustMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        /**
         * Get the only one value (latest user) from observable when 
         * I fetch the recipes and after that unsubscribe automatically.
         * I am not getting future users because I just want to get them on 
         * demand when fetchRecipes is called, and I don't want to set up an 
         * ongoing subscription which gives me users at a point of time I don't 
         * need them anymore.
         */
        return this.authService.user.pipe(
            take(1),
            /**
             * exhaustMap - waits for the first user observable to complete after 
             * we took the latest user. When we get the data from previous observable (user observable),
             * return a new observable which will then replace our previous observable in the 
             * observable chain.
             */
            exhaustMap(user => {
                // If we don't have a user, return the original request without modifying
                if (!user) {
                    return next.handle(req);
                }

                // If we have a user, return a modified request
                const modifiedRequest = req.clone({
                    params: new HttpParams().set('auth', user.token)
                })
                return next.handle(modifiedRequest);
            }));

    }
}