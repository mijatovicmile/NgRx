import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';

// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';

// Routes
import { AppRoutingModule } from './app-routing.module';

// Shared module
import { SharedModule } from './shared/shared.module';

// Core module - Services
import { CoreModule } from './core.module';

// Reducer 
import { shoppingListReducer } from './shopping-list/store/shopping-list.reducer';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot({
      shoppingList: shoppingListReducer
    }),
    SharedModule,
    CoreModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }