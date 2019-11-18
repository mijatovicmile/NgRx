import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Ingredient } from 'src/app/shared/ingredient.model';

import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('ingredientForm', { static: false }) ingredientForm: NgForm;

  private ingredientEditSub: Subscription;

  editMode: boolean = false;

  editedIngredient: Ingredient;

  constructor(private store: Store<fromApp.AppState>) { }


  ngOnInit() {
    this.ingredientEditSub = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedIngredient = stateData.editedIngredient;
        this.ingredientForm.setValue({
          name: this.editedIngredient.name,
          amount: this.editedIngredient.amount
        })
      } else {
        this.editMode = false;
      }
    });
  }


  onSubmit(form: NgForm) {

    let ingredientName: string = form.value.name;
    let ingredientAmount: number = form.value.amount;

    const newIngredient = new Ingredient(ingredientName, ingredientAmount);

    // If we are not in Edit mode
    if (!this.editMode) {
      // this.shoppingListService.addIngredient(newIngredient);
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient))
    } else {
      // If we are in edit mode
      // this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient)
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredient))
    }

    // Reset edit mode and form values after we submit the form 
    this.editMode = false;
    form.resetForm();
  }

  onClear() {
    this.ingredientForm.resetForm();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete() {
    // this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
  }

  ngOnDestroy() {
    this.ingredientEditSub.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }
}
