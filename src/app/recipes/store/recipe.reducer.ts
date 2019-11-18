import { Recipe } from '../recipe.model';
import * as recipeActions from './recipe.actions';

export interface State {
    recipes: Recipe[]
}

const initialState: State = {
    recipes: []
}

export function recipeReducer(state = initialState, action: recipeActions.RecipeActions) {
    switch(action.type) {
        case recipeActions.SET_RECIPES:
            return {
                ...state,
                /**
                 * Pull out all the element from the recipes array and add 
                 * these recipes here to the new recipes array of the new state
                 */
                recipes: [...action.payload]
            };
        case recipeActions.ADD_RECIPE: 
            return {
                ...state,
                // Copy all the old recipes and then add new recipe (action.payload)
                recipes: [...state.recipes, action.payload]
            };    
        case recipeActions.UPDATE_RECIPE: 
            // Copy of the old recipe I want to update
            const updatedRecipe = { 
                /**
                 * Fetch the updated recipe by reaching out to state recipes 
                 * and there I use action.payload to get the recipe with the index I want to change
                 */
                ...state.recipes[action.payload.index],
                /**
                 * Extract the all properties from new recipe and merge them into this object
                 * which is my copy of the old recipe, and this will overwrite all the values
                 * of the old recipe with the updated values.
                 */
                ...action.payload.newRecipe 
            };

            // List of updated recipes - copy my old recipe list
            const updatedRecipes = [...state.recipes];

            /**
             * Select the right recipe through the index and set and overwrite that element 
             * at this index in the copied list , with new value
             */
            updatedRecipes[action.payload.index] = updatedRecipe;

            return {
                ...state,
                recipes: updatedRecipes
            };    
        case recipeActions.DELETE_RECIPE: 
            return {
                ...state,
                recipes: state.recipes.filter((recipe, index) => {
                    return index !== action.payload;
                })
            };    
        default: 
            return state;    
    }
}