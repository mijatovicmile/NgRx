import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})

export class AuthComponent implements OnInit, OnDestroy {

    private storeSubscription: Subscription;

    constructor(private store: Store<fromApp.AppState>) { }

    isLoginMode = false;
    isLoading = false;
    error: string = '';

    ngOnInit() {
        this.storeSubscription = this.store.select('auth').subscribe(authState => {
            this.isLoading = authState.loading;
            this.error = authState.authError;
            if(this.error) {
                this.error = this.error;
            }
        })
    }

    // Swith to Login and Sign Up mode
    switchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    // On Submit form
    onSubmit(form: NgForm) {
        if (form.invalid) {
            return;
        }

        let email = form.value.email;
        let password = form.value.password;

        if (this.isLoginMode) {
            this.store.dispatch(new AuthActions.LoginStart({email: email, password: password}))
        } else {
            this.store.dispatch(new AuthActions.SignupStart({ email: email, password: password }))
        }

        form.resetForm();
    }

    ngOnDestroy() {
        this.storeSubscription.unsubscribe();
    }
}