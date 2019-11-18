// Action interface
import { Action } from '@ngrx/store';

// Action identifiers
export const LOGIN_START = '[Auth] Login Start';
export const AUTHENTICATE_SUCCESS = '[Auth] Login';
export const AUTHENTICATE_FAIL = '[Auth] Login Fail';
export const SIGNUP_START = '[Auth] Signup Start';
export const AUTO_LOGIN  = '[Auth] Auto Login';
export const LOGOUT = '[Auth] Logout';

// Login
export class AuthenticateSuccess implements Action {
    readonly type = AUTHENTICATE_SUCCESS;

    constructor(public payload: {
        email: string,
        userId: string,
        token: string,
        expirationDate: Date,
        redirect: boolean
    }) { }
}

// Logout
export class Logout implements Action {
    readonly type = LOGOUT;
}

export class LoginStart implements Action {
    readonly type = LOGIN_START;

    constructor(public payload: { email: string, password: string }) {}
}

export class AuthenticateFail implements Action {
    readonly type = AUTHENTICATE_FAIL;

    // Error message as string
    constructor(public payload: string) {}
}

export class SignupStart implements Action {
    readonly type = SIGNUP_START;

    constructor(public payload: { email: string, password: string }) {}
}

export class AutoLogin implements Action {
    readonly type = AUTO_LOGIN;
}

/**
 * Combination of all the types I want to include,
 * so here I will create a union of the different action types
 */
export type AuthActions = 
    AuthenticateSuccess 
    | Logout 
    | LoginStart 
    | AuthenticateFail 
    | SignupStart
    | AutoLogin
