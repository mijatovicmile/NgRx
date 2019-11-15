import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../auth/auth.service';

import { map, tap, take, exhaustMap } from 'rxjs/operators';

@Injectable()
export class DataStorageService {
    constructor(private http: HttpClient,
        private recipeService: RecipeService,
        private authService: AuthService) { }

    // Save recipes to database (Firebase)
    saveRecipes() {
        let recipeData = this.recipeService.getAllRecipes();
        /**
         * We could definitely make a post request if we would want to add one recipe,
         * but I want to store all recipes and to overwrite any previous recipes 
         */
        this.http.put('https://recipe-book-e72c8.firebaseio.com/recipes.json', recipeData)
            .subscribe((recipe: Recipe[]) => {
                console.log('Saved recipes', recipe);
            }, error => {
                console.log('Error', error.message);
            }
            );
    }

    // Fetch recipes from database (Firebase)
    fetchRecipes() {
        return this.http
            .get<Recipe[]>(
                'https://recipe-book-e72c8.firebaseio.com/recipes.json'
            )
            .pipe(
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
                        }
                    });
                    /**
                     * Tap operator allows us to execute some code without
                     * altering the data that is funneled through observable
                     */
                }),
                tap(recipes => {
                    this.recipeService.setRecipes(recipes);
                })
            );
    }
}