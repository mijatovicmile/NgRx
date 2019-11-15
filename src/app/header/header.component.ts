import { Component, OnInit, OnDestroy } from '@angular/core';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';

import { Subscription } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {
    constructor(private dataStorageService: DataStorageService,
        private authService: AuthService) { }

    isAuthenticated = false;
    userIsAuthenticated: Subscription;

    ngOnInit() {
        this.userIsAuthenticated = this.authService.user.subscribe(user => {
            // if (user) {
            //     this.isAuthenticated = true;
            // } else {
            //     this.isAuthenticated = false;
            // }
            this.isAuthenticated = user ? true : false;
        })
    }

    onSaveRecipes() {
        this.dataStorageService.saveRecipes();
    }

    onFetchRecipes() {
        this.dataStorageService.fetchRecipes().subscribe();
    }

    onLogout() {
        this.authService.logout();
    }

    ngOnDestroy() {
        this.userIsAuthenticated.unsubscribe();
    }
}