import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router, UrlTree } from '@angular/router';

import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AuthService } from './auth.service';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, 
                private router: Router, 
                private store: Store<fromApp.AppState>) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        boolean | 
        UrlTree |
        Promise<boolean | UrlTree> |
        Observable<boolean | UrlTree> {
        return this.store.select('auth').pipe(
            take(1),
            map(authState => {
                return authState.user;
            }),
            map(user => {
                /**
                 * Transform observable that returns a user object, to return a boolean
                 */
                const isAuth = !!user; // return user ? true : false
                if (isAuth) {
                    return true;
                }
                // If condition is false
                return this.router.createUrlTree(['/auth']);
            }))
        // tap(isAuth => {
        //     if (!isAuth) {
        //         this.router.navigate(['/auth']);
        //     }
        // }))
    }
}