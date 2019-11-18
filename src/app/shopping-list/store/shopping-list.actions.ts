// Action interface
import { Action } from '@ngrx/store';
// Ingredient model
import { Ingredient } from 'src/app/shared/ingredient.model';

// Action identifiers
export const ADD_INGREDIENT = '[Shopping List] Add Ingredient';
export const ADD_INGREDIENTS = '[Shopping List] Add Ingredients';
export const UPDATE_INGREDIENT = '[Shopping List] Update Ingredient';
export const DELETE_INGREDIENT = '[Shopping List] Delete Ingredient';
export const START_EDIT = '[Shopping List] Start Edit';
export const STOP_EDIT = '[Shopping List] Stop Edit';

// Add single ingredient
export class AddIngredient implements Action {
    /**
     * Action interface forces us to structure the add ingredient class in a certain way
     * readonly type - identifier of this action
     * payload with type of Ingredient model
     */
    readonly type = ADD_INGREDIENT;

    constructor(public payload: Ingredient) { }
}

// Add ingredients
export class AddIngredients implements Action {
    readonly type = ADD_INGREDIENTS;

    constructor(public payload: Ingredient[]) { }
}

// Update ingredient
export class UpdateIngredient implements Action {
    readonly type = UPDATE_INGREDIENT;

    constructor(public payload: Ingredient) { }
}

// Delete ingredient
export class DeleteIngredient implements Action {
    readonly type = DELETE_INGREDIENT;
}

// Start Edit
export class StartEdit implements Action {
    readonly type = START_EDIT;

    // Number of the ingredient I want to edit
    constructor(public payload: number) { }
}

// Stop Edit
export class StopEdit implements Action {
    readonly type = STOP_EDIT;
}

/**
 * Combination of all the types I want to include,
 * so here I will create a union of the different action types
 */
export type ShoppingListActions = AddIngredient | AddIngredients | UpdateIngredient | DeleteIngredient | StartEdit | StopEdit