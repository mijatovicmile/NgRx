import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

// Recipe Model
import { Recipe } from '../recipe.model';

import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  // Array of Recipes which is initially an empty Array 
  recipes: Recipe[];

  constructor(private route: ActivatedRoute,
              private router: Router, 
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.subscription = this.store
      .select('recipes')
      .pipe(map(recipeState => recipeState.recipes))
      .subscribe(
        (recipes: Recipe[]) => {
          this.recipes = recipes;
        }
      );
  }

  // On add new recipe
  addNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
