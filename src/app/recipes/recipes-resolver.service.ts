import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { of } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';

import { Recipe } from './recipe.model';

import * as fromApp from '../store/app.reducer';
import * as recipesActions from '../recipes/store/recipe.actions';

@Injectable()
export class RecipesResolverService implements Resolve<Recipe[]> {
    
    constructor(private store: Store<fromApp.AppState>,
                private actions$: Actions) {}
    
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // Select recipes from Store 
        return this.store.select('recipes').pipe(
            take(1),
            map(recipesState => {
            /**
             * This is an empty array of recipes if I have not fetched any recipes yet, 
             * or otherwise it is filled array 
             */
            return recipesState.recipes;
        }),
        switchMap(recipes => {
            // If I don't have any recipes 
            if(recipes.length === 0) {
                /**
                 * Wait for the effect that is triggered by that action to complete and then run the logic...
                 * Wait for recipes to be set and then resolver dispatch 
                 */
                this.store.dispatch(new recipesActions.FetchRecipes());
                return this.actions$.pipe(
                    /**
                     * Listen to a SET_RECIPES action to occur and then complete this observable.
                     * When SET_RECIPES action is called, I know that recipes are there and 
                     * take only one value (interested in this event once), and unsubscribe from the subscription
                     */
                    ofType(recipesActions.SET_RECIPES), 
                    take(1)
                )
            } else {
                /**
                 * I don't send any request if I already have recipes
                 */
                return of(recipes);
            }
        }))
    }
}