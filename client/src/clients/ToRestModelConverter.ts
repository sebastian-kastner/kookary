import { RecipeJsonld, TagJsonld, ImageJsonld, IngredientJsonld, RecipeIngredientJsonld } from '../../rest/models'
import { Recipe, Tag, Image, Ingredient, RecipeIngredient } from '../types'
import * as ep from './endpoints'

export class ToRestModelConverter {

    public convertTag (apiTag: Tag): TagJsonld {
        return {
          tagId: apiTag.tagId,
          name: apiTag.name
        }
      }
      
      public convertImage (apiImage: Image): ImageJsonld {
        return {
          imageId: apiImage.imageId,
          date: apiImage.date,
          path: apiImage.path
        }
      }
      
      public convertIngredient (apiIngredient: Ingredient | null | undefined): IngredientJsonld {
        if(!apiIngredient) {
          return {};
        }
        return {
          ingredientId: apiIngredient.ingredientId,
          name: apiIngredient.name
        }
      }

      private toApiId(prefix: string, id: number | string | null | undefined): string {
        if(!id) {
          return '';
        }
        return prefix + "/" + id;
      }
      
      public convertRecipeIngredient (viewModelIngredient: RecipeIngredient, recipeId?: string): RecipeIngredientJsonld {
        return {
          recipeIngredientId: viewModelIngredient.recipeIngredientId,
          ingredient: this.toApiId(ep.INGREDIENTS_ENDPOINT, viewModelIngredient.ingredient?.ingredientId),
          unit: viewModelIngredient.unit,
          quantity: viewModelIngredient.quantity,
          recipe: (recipeId) ? this.toApiId(ep.RECIPES_ENDPOINT, recipeId) : undefined
        }
      }
      
      public convertRecipeIngredients (viewModelIngredients?: RecipeIngredient[], recipeId?: string): RecipeIngredientJsonld[] {
        if (!viewModelIngredients) {
          return []
        }
        const ingredients: RecipeIngredientJsonld[] = []
        viewModelIngredients.forEach((viewModelIngredient) => {
          if(viewModelIngredient.ingredient?.ingredientId) {
            ingredients.push(this.convertRecipeIngredient(viewModelIngredient, recipeId))
          }
        })
        return ingredients
      }
      
      public convertRecipe (apiRecipe: Recipe): RecipeJsonld {
        return {
          recipeId: apiRecipe.recipeId,
          name: apiRecipe.name,
          description: apiRecipe.description,
          servings: apiRecipe.servings,
          source: apiRecipe.source,
          rating: apiRecipe.rating,
          dateAdded: apiRecipe.dateAdded,
          // FIXME convert images
          image: [],
          ingredients: this.convertRecipeIngredients(apiRecipe.ingredients, apiRecipe.recipeId?.toString()),
          // FIXME convert tags
          tag: []
        }
      }
    
}