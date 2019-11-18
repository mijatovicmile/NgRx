import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

// Type definition which describes how state for this reducer looks like
export interface State {
    ingredients: Ingredient[],
    editedIngredient: Ingredient,
    editedIngredientIndex: number
}

// Set up an initial state
const initialState: State = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Orange', 4)
    ],
    editedIngredient: null,
    editedIngredientIndex: -1
}

/**
 * Reducer is a function which receives two arguments
 * @param state Current state before it was changed by Reducer 
 * (initialState as default value - the first time reducer will run, it will receive initial state for subsequent actions)
 * @param action The action that triggers the reducer and in the end, update the state
 */
export function shoppingListReducer(state: State = initialState, action: ShoppingListActions.ShoppingListActions) {
    // Find out which type of action it is and update the state
    switch(action.type) {
        // ADD_INGREDIENT Action Type
        case ShoppingListActions.ADD_INGREDIENT:
            /**
             * Return a new state because state changes with NgRx always have to be immutable,
             * that means that we must not edit the existing or the previous state (it's forbidden)
             */
            return {
                /**
                 * Replace the old state and to not lose all the old data, 
                 * copy the old state with spread operator. Pulls out all the properties
                 * of the old state (copy) and adds these properties to this new object
                 */
                ...state,
                ingredients: [...state.ingredients, action.payload]
            };
        case ShoppingListActions.ADD_INGREDIENTS: 
            return {
                ...state,
                ingredients: [...state.ingredients, ...action.payload]
            };
        case ShoppingListActions.UPDATE_INGREDIENT:
            // Get Ingredient I want to edit
            const ingredient = state.ingredients[state.editedIngredientIndex];

            // Create a copy of ingredient (name and amount)
            const updatedIngredient = {
                ...ingredient,
                ...action.payload
            };

            /**
             * Copy the ingredient elements from old state (old state ingredients), 
             * so updatedIngredients is not a new array with the data of the old states array.
             */
            const updatedIngredients = [...state.ingredients];

            /**
             * Replacing the old element with that index in the copied 
             * updatedIngredients array with the copied updatedIngredient,
             * and now updatedIngredient is an array of ingredients where I 
             * overwrote one igredient 
             */
            updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

            return {
                ...state, 
                ingredients: updatedIngredients,
                editedIngredientIndex: -1,
                editedIngredient: null
            };
        case ShoppingListActions.DELETE_INGREDIENT:
            return {
                ...state,
                ingredients: state.ingredients.filter((ingredient, ingredientIndex) => {
                    return ingredientIndex != state.editedIngredientIndex;
                }),
                editedIngredientIndex: -1,
                editedIngredient: null
            };
        case ShoppingListActions.START_EDIT:     
            return {
                ...state,
                editedIngredientIndex: action.payload,
                editedIngredient: { ...state.ingredients[action.payload] }
            };
        case ShoppingListActions.STOP_EDIT:     
            return {
                ...state,
                editedIngredient: null,
                editedIngredientIndex: -1
            }
        default:
            /**
             *  Handle any cases I am not explicitly handling and here I want to 
             * return the unchanged state and that will be the initial state
             */
            return state;     
    };
}