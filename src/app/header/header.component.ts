import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';
import * as authActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipe.actions';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {
    constructor(private store: Store<fromApp.AppState>) { }

    isAuthenticated = false;
    userIsAuthenticated: Subscription;

    ngOnInit() {
        this.userIsAuthenticated = this.store
            .select('auth')
            .pipe(map(authState => authState.user))
            .subscribe(user => {
            // if (user) {
            //     this.isAuthenticated = true;
            // } else {
            //     this.isAuthenticated = false;
            // }
            this.isAuthenticated = user ? true : false;
        })
    }

    onSaveRecipes() {
        this.store.dispatch(new RecipeActions.StoreRecipes());
    }

    onFetchRecipes() {
        this.store.dispatch(new RecipeActions.FetchRecipes());
    }

    onLogout() {
        this.store.dispatch(new authActions.Logout());
    }

    ngOnDestroy() {
        this.userIsAuthenticated.unsubscribe();
    }
}