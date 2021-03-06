import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';

// Routes
import { AppRoutingModule } from './app-routing.module';

// Shared module
import { SharedModule } from './shared/shared.module';

// Core module - Services
import { CoreModule } from './core.module';

import * as fromApp from './store/app.reducer';

import { AuthEffects } from './auth/store/auth.effects';
import { RecipeEffects } from './recipes/store/recipe.effects';

import { environment } from 'src/environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([AuthEffects, RecipeEffects]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    StoreRouterConnectingModule.forRoot(),
    SharedModule,
    CoreModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }