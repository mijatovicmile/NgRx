import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';

import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';

import { Subject } from 'rxjs';

@Injectable()
export class RecipeService {

    recipeChanged = new Subject<Recipe[]>();

    constructor(private store: Store<fromApp.AppState>) { }

    private recipes: Recipe[] = [];

    // Set Recipes
    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipeChanged.next(this.recipes.slice());
    }

    // Get all recipes
    getAllRecipes() {
        // Return a new Array which is an exact copy of the one in this service file
        return this.recipes.slice();
    }

    // Get Recipe by ID
    getRecipeById(index: number) {
        return this.recipes.slice()[index];
    }

    // Add Ingredients to Shopping List
    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        // this.shoppingListService.addIngredients(ingredients);
        this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
    }

    // Add a new recipe
    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        // New copy of recipe array after adding new recipe
        this.recipeChanged.next(this.recipes.slice());
    }

    // Update existing recipe
    updateRecipe(index: number, recipe: Recipe) {
        this.recipes[index] = recipe;
        // New copy of recipe array after updating an existing recipe
        this.recipeChanged.next(this.recipes.slice());
    }

    // Delete recipe 
    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipeChanged.next(this.recipes.slice());
    }
}