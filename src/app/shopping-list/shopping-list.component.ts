import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';

import { Ingredient } from '../shared/ingredient.model';


@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[] }>;

  // private ingredientChangeSub: Subscription;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');

    // Get all ingredients (Copy of ingredients)
    // this.ingredients = this.shoppingListService.getIngredients();

    // this.ingredientChangeSub = this.shoppingListService.ingredientsChanged
    //   .subscribe((ingredients: Ingredient[]) => {
    //     this.ingredients = ingredients;
    //   }
    // )
  }

  // Edit Ingredient
  editIngredient(index: number) {
    // this.shoppingListService.ingredientEdit.next(index);
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }

  ngOnDestroy() {
    // this.ingredientChangeSub.unsubscribe();
  }
}
