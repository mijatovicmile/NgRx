import { Injectable } from '@angular/core';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';

import { ShoppingListService } from '../shopping-list/shopping-list.service';

import { Subject } from 'rxjs';

@Injectable()
export class RecipeService {

    recipeChanged = new Subject<Recipe[]>();

    constructor(private shoppingListService: ShoppingListService) {}

    // Array of Recipes
    // private recipes: Recipe[] = [
    //     new Recipe('A Test Recipe 1', 
    //             'A Test Recipe Description 1', 
    //             'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg',
    //             [
    //                 new Ingredient('Ingredient 1', 1),
    //                 new Ingredient('Ingredient 2', 2),
    //                 new Ingredient('Ingredient 3', 2)
    //             ]),
    //     new Recipe('A Test Recipe 2', 
    //             'A Test Recipe Description 2', 
    //             'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg',
    //             [
    //                 new Ingredient('Ingredient 7', 1),
    //                 new Ingredient('Ingredient 8', 2),
    //                 new Ingredient('Ingredient 9', 2)
    //             ]),
    //     new Recipe('A Test Recipe 3', 
    //             'A Test Recipe Description 3', 
    //             'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg',
    //             [
    //                 new Ingredient('Ingredient 10', 1),
    //                 new Ingredient('Ingredient 11', 2),
    //                 new Ingredient('Ingredient 12', 2)
    //             ]
    //     )
    // ];

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
        this.shoppingListService.addIngredients(ingredients);
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