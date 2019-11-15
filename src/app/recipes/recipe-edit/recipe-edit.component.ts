import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';

import { RecipeService } from '../recipe.service';

@Component({
    selector: 'app-recipe-edit',
    templateUrl: './recipe-edit.component.html',
    styleUrls: ['./recipe-edit.component.css']
})

export class RecipeEditComponent implements OnInit {

    id: number;
    editMode: boolean = false;
    recipeForm: FormGroup;

    constructor(private route: ActivatedRoute, 
                private router: Router,
                private recipeService: RecipeService) { }

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.id = +params['id'];
            /**
             * Check if params has an ID property, 
             * if it has one, then this will actually be a string with the ID,
             * otherwise it will be undefined... By comparing it to null and checking if it is not null,
             * I am checking does it have the ID, because the ID will only be not undefined if we are 
             * in edit mode, because then an ID will be present.
             * 
             * So, if the ID indeed is undefined and therefore equal to null, this will return false because
             * I am checking the opposite and therefore, we are in new mode.
             */
            this.editMode = params['id'] != null;

            /**
             * Initialize recipe form whenever our route params change, 
             * because that indicates that we reloaded the page
             */
            this.initForm();
        })
    }

    // Initialize recipe form based on mode (new or edit)
    private initForm() {
        let recipeName = '';
        let recipeImagePath = '';
        let recipeDescription = '';
        // We don't have any ingredients by default (ingredients array)
        let recipeIngredients = new FormArray([]);

        // If we are in the edit mode
        if (this.editMode) {
            
            // Recipe we're currently editing
            const recipe = this.recipeService.getRecipeById(this.id);

            recipeName = recipe.name;
            recipeImagePath = recipe.imagePath;
            recipeDescription = recipe.description;

            // Check if we already have ingredients in recipe array
            if(recipe['ingredients']) {
                // If is defined, loop through recipe ingredients Array
                for (let ingredient of recipe.ingredients) {
                    // Push ingredients in recipeIngredients formArray
                    recipeIngredients.push(
                        // I will push FormGroup because we have two FormControls which will control a single ingredient(name and amount)
                        new FormGroup({
                            name: new FormControl(ingredient.name, Validators.required),
                            amount: new FormControl(ingredient.amount, [
                                Validators.required,
                                Validators.pattern(/^[1-9]+[0-9]*$/)
                            ])
                        })
                    );
                }
            }
        }

        this.recipeForm = new FormGroup({
            name: new FormControl(recipeName, Validators.required),
            imagePath: new FormControl(recipeImagePath, Validators.required),
            description: new FormControl(recipeDescription, Validators.required),
            ingredients: recipeIngredients
        })
    }

    getControls() {
        return (<FormArray>this.recipeForm.get('ingredients')).controls;
    }

    onAddIngredient() {
        (<FormArray>this.recipeForm.get('ingredients')).push(
            new FormGroup({
                name: new FormControl('', Validators.required),
                amount: new FormControl('', [
                    Validators.required,
                    Validators.pattern(/^[1-9]+[0-9]*$/)
                ])
            })
        )
    }

    deleteIngredient(index: number) {
        (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
        // (<FormArray>this.recipeForm.get('ingredients')).clear(); // Deleting all items in a FormArray
    }

    // Cancel the recipe (go back one level)
    onCancelRecipe() {
        this.router.navigate(['../'], { relativeTo: this.route });
    }

    // On submit recipe form 
    onSubmit() {
        // const newRecipe = new Recipe(
        //     this.recipeForm.value['name'],
        //     this.recipeForm.value['description'],
        //     this.recipeForm.value['imagePath'],
        //     this.recipeForm.value['ingredients']
        // )

        // If we are in the edit mode
        if(this.editMode) {
            // Update the recipe
            this.recipeService.updateRecipe(this.id, this.recipeForm.value)
        } else {
            // If we are in the new mode
            this.recipeService.addRecipe(this.recipeForm.value);
        }

        this.router.navigate(['../'], { relativeTo: this.route });
    }
}