import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthResponseData } from './auth-response-data.model';

import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';

/**
 * Service which will be responsible for
 * signing user in, signing in, managing token of user
 */
@Injectable()
export class AuthService {

    /**
     * Subject - Subject to which we can subscribe and get information whenever new data is emitted.
     * For example emit a new user whenever we have one logged in or logout,
     * and also when the token expired. 
     * 
     * BehaviorSubject - Different type of Subject RxJS offers (we also can call .next to emit a value
     * and we can subscribe to it to be informed about new values) which gives subscribers immediate
     * access to the previously emitted value even if they haven't subscribed at the point of time 
     * that value was emitted. That means that we can get access to the currently active user even if
     * we only subscribe after that user has been emitted
     */
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient,
        private router: Router) { }

    // Sign up 
    signup(email: string, password: string) {
        const api_key = environment.firebaseAPIKey;
        const url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + api_key;

        return this.http.post<AuthResponseData>(url,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            catchError(this.handleError),
            /**
             * Tap was an operator that allows us to perform some action without changing the response,
             * so it steps into that observable chain but it doesn't stop it, block it or change it,
             * it just run some code with the data we get back from observable, so with the response
             * in this case
             */
            tap(responseData => {
                this.handleAuthentication(
                    responseData.email,
                    responseData.localId,
                    responseData.idToken,
                    +responseData.expiresIn
                );
            })
        );
    }

    // Login
    login(email: string, password: string) {
        const api_key = "AIzaSyAGLtWjTAT6UiDmKYo4QGfh-6ayNrS5QWY"
        const url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + api_key;

        return this.http.post<AuthResponseData>(url,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            catchError(this.handleError),
            tap(responseData => {
                this.handleAuthentication(
                    responseData.email,
                    responseData.localId,
                    responseData.idToken,
                    +responseData.expiresIn
                );
            })
        );
    }

    /**
     * Automatically set the user to logged-in when the application starts and 
     * it will do so by looking into the localStorage and checking whether there 
     * is an existing user snapshot stored.
     */
    autoLogin() {
        // Retrieve the data from localStorage
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));

        // If we don't have userData stored in localStorage
        if (!userData) {
            return;
        }

        const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
        )

        // If token of loaded user is valid
        if (loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
            this.autoLogout(expirationDuration);
        }
    }

    /**
     * Automatically logout when the token is expired
     */
    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    // Logout
    logout() {
        // Threats the user as unauthenticated
        this.user.next(null);

        // Redirect user to authentication route after logout
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');

        // Clear the expiration timer when we manually logged out
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }

        this.tokenExpirationTimer = null;
    }

    // Handle authentication
    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        // Expiration date in miliseconds
        const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
        const user = new User(
            email,
            userId,
            token,
            expirationDate
        );
        // Emit our currently logged in user in application
        this.user.next(user);

        this.autoLogout(expiresIn * 1000);

        // Set authentication token in LocalStorage
        localStorage.setItem('userData', JSON.stringify(user));
    }

    // Error handling
    private handleError(errorResponse: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';

        if (!errorResponse.error || !errorResponse.error.error) {
            return throwError(errorMessage);
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
        return throwError(errorMessage);
    }
}
