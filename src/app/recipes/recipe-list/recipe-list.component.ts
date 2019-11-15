import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

// Recipe Model
import { Recipe } from '../recipe.model';

// Recipe Service
import { RecipeService } from '../recipe.service';

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
              private recipeService: RecipeService) { }

  ngOnInit() {
    this.subscription = this.recipeService.recipeChanged
      .subscribe(
        (recipes: Recipe[]) => {
          this.recipes = recipes;
        }
      );
    // Get copy or recipes (copy or Recipes Array)
    this.recipes = this.recipeService.getAllRecipes();
  }

  // On add new recipe
  addNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
