import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
// Check whether the platform is a browser
import { isPlatformBrowser } from '@angular/common';

import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import * as authActions from './auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit {
  constructor(private store: Store<fromApp.AppState>,
              /**
               * Please look for to globally provided value with this identifier and inject the value 
               * which is globally provided by Angular into this class and store it in this platformID property
               */
              @Inject(PLATFORM_ID) private platformId) { }

  ngOnInit() {
    /**
     * Find out where my code in running and I only want it displached 
     * AutoLogin if the code is running in a browser, and NOT in the server.
     * AutoLogin relies on localStorage which is not available on the server 
     */
    if (isPlatformBrowser(this.platformId)) {
      this.store.dispatch(new authActions.AutoLogin());
    }
  }
}
