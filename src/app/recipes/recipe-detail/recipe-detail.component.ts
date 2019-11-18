import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

import { Recipe } from '../recipe.model';

import * as fromApp from '../../store/app.reducer';
import * as RecipeActions from '../store/recipe.actions';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  recipe: Recipe; 
  id: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.route.params
    .pipe(
      map(params => {
        return +params['id']
      }), 
      switchMap(id => {
        this.id = id;
        return this.store.select('recipes')
      }),
      map(recipesState => {
        return recipesState.recipes.find((recipe, index) => {
          return index === this.id;
        });
      })
    ).subscribe(recipe => {
        this.recipe = recipe;
    })
  }

  // Add Recipe to shopping list
  addToShoppingList() {
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients));
  }

  // Edit recipe
  editRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
    // this.router.navigate(['../', this.id, 'edit' ], { relativeTo: this.route });
  }

  // Delete recipe
  deleteRecipe() {
    this.store.dispatch(new RecipeActions.DeleteRecipe(this.id));
    // After we delete the recipe, navigate away to recipe list 
    this.router.navigate(['/recipes']);
  }
}