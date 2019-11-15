import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Recipe } from './recipe.model';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';

@Injectable()
export class RecipesResolverService implements Resolve<Recipe[]> {
    
    constructor(private dataStorageService: DataStorageService,
                private recipeService: RecipeService) {}
    
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Recipe[]> | Promise<Recipe[]> | Recipe[] {
        /**
         * Check whether we do have recipes and only fetch new ones
         * if we don't
         */
        let recipes = this.recipeService.getAllRecipes();

        // If we don't have recipes
        if(recipes.length === 0) {
            return this.dataStorageService.fetchRecipes();
        } else {
            /**
             * If we have recipes (length > 0), we can just 
             * return these recipes because then, we do have
             * recipes so no need to fetch them again.
             */
            return recipes;
        }
    }
}