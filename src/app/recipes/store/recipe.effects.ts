import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { Recipe } from '../recipe.model';

import * as fromApp from '../../store/app.reducer';
import * as recipesActions from './recipe.actions';

@Injectable()
export class RecipeEffects {

    // When one of this actions occurs, I want to kick off appropriate effect from here

    @Effect()
    fetchRecipes = this.actions$.pipe(
        ofType(recipesActions.FETCH_RECIPES),
        // Send HTTP request to fetch the recipes
        switchMap(() => {
            return this.http.get<Recipe[]>(
                'https://recipes-3326e.firebaseio.com/recipes.json'
            );
        }),
        /**
         * When we're fetching the recipes, it would make sense that
         * we make sure that we always have ingredients, even if it's
         * just an empty array, but the data we loaded in the end has
         * has some ingredients and ingredients property is not undefined.
         * And for that, we can transform our data.
         */
        map(recipes => {
            // Recipe that might do not have an ingredients property
            return recipes.map(recipe => {
                /**
                 * Return the original recipe but if that recipe doesn't have
                 * an ingredient array, set ingredients to an empty array instead
                 */
                return {
                    ...recipe,
                    ingredients: recipe.ingredients ? recipe.ingredients : []
                };
            });
        }),
        map(recipes => {
            return new recipesActions.SetRecipes(recipes);
        })
    )

    @Effect({ dispatch: false })
    storeRecipes = this.actions$.pipe(
        ofType(recipesActions.STORE_RECIPES),
        // Merge value from another observable into this observable
        withLatestFrom(this.store.select('recipes')),
        // Send HTTP request to store the recipes (PUT method)
        switchMap(([actionData, recipesState]) => {
            return this.http
                .put('https://recipes-3326e.firebaseio.com/recipes.json', 
                recipesState.recipes
            )
        })
    )

    constructor(private actions$: Actions,
                private http: HttpClient,
                private store: Store<fromApp.AppState>) {}
}