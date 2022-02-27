import { RecipesJsonld, TagsJsonld, ImagesJsonld, IngredientsJsonld, RecipeIngredientJsonld } from '../../rest/models'
import { Recipe, Tag, Image, Ingredient, RecipeIngredient } from '../types'

export class ToRestModelConverter {

    public convertTag (apiTag: Tag): TagsJsonld {
        return {
          tagId: apiTag.tagId,
          name: apiTag.name
        }
      }
      
      public convertImage (apiImage: Image): ImagesJsonld {
        return {
          imageId: apiImage.imageId,
          date: apiImage.date,
          path: apiImage.path
        }
      }
      
      public convertIngredient (apiIngredient: Ingredient): IngredientsJsonld {
        return {
          ingredientId: apiIngredient.ingredientId,
          name: apiIngredient.name
        }
      }
      
      public convertRecipeIngredient (viewModelIngredient: RecipeIngredient): RecipeIngredientJsonld {
        let ingredientId = viewModelIngredient.ingredientId;
        if(!ingredientId) {
          ingredientId = viewModelIngredient.ingredient?.ingredientId;
        }

        return {
          ingredientId: ingredientId,
          // FIXME does this work?
          // ingredient: viewModelIngredient.ingredientId,
          // recipeId: viewModelIngredient.recipeId,
          recipe: viewModelIngredient.ingredientId?.toString(),
          amount: viewModelIngredient.amount,
          unit: viewModelIngredient.unit
        }
      }
      
      public convertRecipeIngredients (viewModelIngredients?: RecipeIngredient[]): RecipeIngredientJsonld[] {
        if (!viewModelIngredients) {
          return []
        }
        const ingredients: RecipeIngredientJsonld[] = []
        viewModelIngredients.forEach((viewModelIngredient) => {
          if(viewModelIngredient.ingredientId || viewModelIngredient.ingredient?.ingredientId) {
            ingredients.push(this.convertRecipeIngredient(viewModelIngredient))
          }
        })
        return ingredients
      }
      
      public convertRecipe (apiRecipe: Recipe): RecipesJsonld {
        return {
          recipeId: apiRecipe.recipeId,
          name: apiRecipe.name,
          description: apiRecipe.description,
          servings: apiRecipe.servings,
          source: apiRecipe.source,
          rating: apiRecipe.rating,
          timesCooked: apiRecipe.timesCooked,
          dateAdded: apiRecipe.dateAdded,
          // FIXME convert images
          image: [],
          recipeIngredients: this.convertRecipeIngredients(apiRecipe.recipeIngredients),
          // FIXME convert tags
          tag: []
        }
      }
    
}