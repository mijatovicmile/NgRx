import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

export class ShoppingListService {

    ingredientsChanged = new Subject<Ingredient[]>();
    ingredientEdit = new Subject<number>();

    private ingredients: Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Orange', 4)
    ]

    // Get all ingredients
    getIngredients() {
        // Return copy of ingredients array
        return this.ingredients.slice();
    }

    // Get ingredient by Id (single ingredient)
    getIngredientById(index: number) {
        // Return the ingredient from ingredients array with specific index (id) number
       return this.ingredients[index];
    }

    // Add new ingredient
    addIngredient(ingredient: Ingredient) {
        this.ingredients.push(ingredient);
        // Inform component that new data is available whenever we change the Array of Ingredients
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    addIngredients(ingredients: Ingredient[]) {
        this.ingredients.push(...ingredients);
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    // Update ingredient
    updateIngredient(index: number, newIngredient: Ingredient) {
        this.ingredients[index] = newIngredient;
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    // Delete ingredient
    deleteIngredient(index: number) {
        this.ingredients.splice(index, 1);
        this.ingredientsChanged.next(this.ingredients.slice());
    }
}