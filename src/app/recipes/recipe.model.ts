import { Ingredient } from '../shared/ingredient.model';

/**
 * Recipe Model
 * 
 * Define how a single recipe looks like
 * 
 * Model is a blueprint for objects we create,
 * so class can be instantiated, so we can create new objects
 * based on the setup we provide here, in this class
 */
export class Recipe {
    name: string;
    description: string;
    imagePath: string;
    ingredients: Ingredient[];

    // Constructor is a build-in function every class has and which will be executed once we create a new instance of this class
    constructor(name: string, description: string, imagePath: string, ingredients: Ingredient[]) {
        this.name = name;
        this.description = description;
        this.imagePath = imagePath;
        this.ingredients = ingredients;
    }
}