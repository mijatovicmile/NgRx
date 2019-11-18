import { Injectable, ErrorHandler } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Actions, ofType, Effect } from '@ngrx/effects';

import { AuthService } from '../auth.service';
import { AuthResponseData } from '../auth-response-data.model';
import { User } from '../user.model';

import { environment } from 'src/environments/environment';

import * as AuthActions from './auth.actions';


// Handle authentication
const handleAuthentication = 
    (
        expiresIn: number, 
        email: string, 
        userId: string, 
        token: string 
    ) => {
    const expirationDate = new Date(
        new Date().getTime() + expiresIn * 1000
    );
    const user = new User(
        email,  
        userId,
        token,
        expirationDate
    )
    localStorage.setItem('userData', JSON.stringify(user));
    return new AuthActions.AuthenticateSuccess({
        email: email,
        userId: userId,
        token: token,
        expirationDate: expirationDate,
        redirect: true
    });
}

// Handle error
const handleError = (errorResponse: any) => {
    let errorMessage = 'An unknown error occurred!';

    if (!errorResponse.error || !errorResponse.error.error) {
        return of(new AuthActions.AuthenticateFail(errorMessage))
    }
    switch (errorResponse.error.error.message) {
        case 'EMAIL_EXISTS':
            errorMessage = 'Email already exists'
            break;
        case 'INVALID_PASSWORD':
            errorMessage = 'You entered an incorect password!'
            break;
        case 'EMAIL_NOT_FOUND':
            errorMessage = 'Email does not exist!'
            break;
    }
    return of(new AuthActions.AuthenticateFail(errorMessage));
}

@Injectable()
export class AuthEffects {
    @Effect()
    authSignup = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((signupAction: AuthActions.SignupStart) => {
            const api_key = environment.firebaseAPIKey;
            const url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + api_key;
            return this.http.post<AuthResponseData>(url,
                {
                    email: signupAction.payload.email,
                    password: signupAction.payload.password,
                    returnSecureToken: true
                }
            ).pipe(
                tap(responseData => {
                    this.authService.setLogoutTimer(+responseData.expiresIn * 1000)
                }),
                map(resData => {
                    return handleAuthentication(
                        +resData.expiresIn,
                        resData.email,
                        resData.localId,
                        resData.idToken
                    )
                }),
                catchError(errorResponse => {
                    return handleError(errorResponse);
                })
            );
        })
    )

    @Effect()
    authLogin = this.actions$.pipe(
        // Defining a filter for which types of effects I want to continue in this observable pipe
        ofType(AuthActions.LOGIN_START),
        // Create a new observable by taking another observable's data
        switchMap((authData: AuthActions.LoginStart) => {
            const api_key = environment.firebaseAPIKey
            const url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + api_key;
    
            return this.http
            .post<AuthResponseData>(url,
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                }
            ).pipe(
                tap(responseData => {
                    this.authService.setLogoutTimer(+responseData.expiresIn * 1000)
                }),
                map(resData => {
                    return handleAuthentication(
                        +resData.expiresIn,
                        resData.email,
                        resData.localId,
                        resData.idToken
                    )
                }),
                catchError(errorResponse => {
                    return handleError(errorResponse);
                })
            );
        })
    );

    @Effect({ dispatch: false })
    authRedirect = this.actions$.pipe(ofType(AuthActions.AUTHENTICATE_SUCCESS), 
        tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
            if(authSuccessAction.payload.redirect) {
                this.router.navigate(['/']);
            }
        })
    );

    @Effect()
    autoLogin = this.actions$.pipe(ofType(AuthActions.AUTO_LOGIN), map(() => {
        // Retrieve the data from localStorage
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));

        // If we don't have userData stored in localStorage
        if (!userData) {
            return { type: 'DUMMY' };
        }

        const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
        )

        // If token of loaded user is valid
        if (loadedUser.token) {
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()

            this.authService.setLogoutTimer(expirationDuration);

            return new AuthActions.AuthenticateSuccess({
                email: loadedUser.email,
                userId: loadedUser.id,
                token: loadedUser.token,
                expirationDate: new Date(userData._tokenExpirationDate),
                redirect: false
            });
        }
        return { type: 'DUMMY' };
    }))

    @Effect({ dispatch: false })
    authLogout = this.actions$.pipe(ofType(AuthActions.LOGOUT), tap(() => {
        this.authService.clearLogoutTimer();
        localStorage.removeItem('userData');
        this.router.navigate(['/auth']);
    }))
    
    constructor(private actions$: Actions,
                private http: HttpClient,
                private router: Router,
                private authService: AuthService) {}
}