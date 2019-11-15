import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

import { AuthResponseData } from './auth-response-data.model';

import { Observable } from 'rxjs';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})

export class AuthComponent {

    constructor(private authService: AuthService,
        private router: Router) { }

    isLoginMode = false;
    isLoading = false;
    error: string = '';

    // Swith to Login and Sign Up mode
    switchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    // On Submit form
    onSubmit(form: NgForm) {
        if (form.invalid) {
            return;
        }

        this.isLoading = true;

        let email = form.value.email;
        let password = form.value.password;

        let authObservable: Observable<AuthResponseData>;

        if (this.isLoginMode) {
            authObservable = this.authService.login(email, password);
        } else {
            authObservable = this.authService.signup(email, password);
        }

        authObservable.subscribe(
            resData => {
                console.log('Authentication', resData);
                this.isLoading = false;
                this.router.navigate(['/recipes']);
            }, errorMessage => {
                this.error = errorMessage;
                this.isLoading = false;
            }
        )

        form.resetForm();
    }
}