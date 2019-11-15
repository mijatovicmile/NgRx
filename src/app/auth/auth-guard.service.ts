import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService,
        private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        boolean |
        UrlTree |
        Promise<boolean | UrlTree> |
        Observable<boolean | UrlTree> {
        return this.authService.user.pipe(
            take(1),
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