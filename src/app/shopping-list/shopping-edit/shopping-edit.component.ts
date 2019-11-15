import { 
  Component, 
  OnInit, 
  OnDestroy, 
  ViewChild
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('ingredientForm', { static: false }) ingredientForm: NgForm;

  private ingredientEditSub: Subscription;

  editMode: boolean = false;

  editedItemIndex: number;

  editedIngredient: Ingredient;

  constructor(private shoppingListService: ShoppingListService) { }


  ngOnInit() {
    this.ingredientEditSub = this.shoppingListService.ingredientEdit
      .subscribe((index: number) => {
        // Index of edited ingredient
        this.editedItemIndex = index;
        // We are in the edit mode
        this.editMode = true;
        this.editedIngredient = this.shoppingListService.getIngredientById(index);

        this.ingredientForm.setValue({
          name: this.editedIngredient.name,
          amount: this.editedIngredient.amount
        })
      })
  }


  onSubmit(form: NgForm) {

    let ingredientName: string = form.value.name;
    let ingredientAmount: number = form.value.amount;

    const newIngredient = new Ingredient(ingredientName, ingredientAmount);

    // If we are not in Edit mode
    if(!this.editMode) {
      this.shoppingListService.addIngredient(newIngredient);
    } else {
      // If we are in edit mode
      this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient)
    }

    // Reset edit mode and form values after we submit the form 
    this.editMode = false;
    form.resetForm();
  }

  onClear() {
    this.ingredientForm.resetForm();
    this.editMode = false;
  }

  onDelete() {
    this.onClear();
    this.shoppingListService.deleteIngredient(this.editedItemIndex);
  }

  ngOnDestroy() {
    this.ingredientEditSub.unsubscribe();
  }
}
