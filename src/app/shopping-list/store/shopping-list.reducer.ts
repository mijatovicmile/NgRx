import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

// Set up an initial state
const initialState = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Orange', 4)
    ]
}

/**
 * Reducer is a function which receives two arguments
 * @param state Current state before it was changed by Reducer (initialState as default value)
 * @param action The action that triggers the reducer
 */
export function shoppingListReducer(state = initialState, action: ShoppingListActions.AddIngredient) {
    switch(action.type) {
        case ShoppingListActions.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: [...state.ingredients, action.payload]
            }
        default:
            return state;     
    };
}