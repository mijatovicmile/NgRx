import { Injectable } from '@angular/core';

import { throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { User } from './user.model';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';


/**
 * Service which will be responsible for
 * signing user in, signing in, managing token of user
 */
@Injectable()
export class AuthService {

    private tokenExpirationTimer: any;

    constructor(private store: Store<fromApp.AppState>) { }

    /**
     * Automatically logout when the token is expired
     */
    setLogoutTimer(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.store.dispatch(new AuthActions.Logout());
        }, expirationDuration);
    }

    // Clear token expiration timer
    clearLogoutTimer() {
        if(this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
            this.tokenExpirationTimer = null;
        }
    }
}
