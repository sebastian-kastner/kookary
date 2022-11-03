import { RecipeJsonld, TagJsonld, IngredientJsonld, RecipeIngredientJsonld } from '../../rest/models'
import { Recipe, Tag, Ingredient, RecipeIngredient } from '../types'
import * as ep from './endpoints'

export class ToRestModelConverter {

  public convertTag(apiTag: Tag): TagJsonld {
    return {
      tagId: apiTag.tagId,
      name: apiTag.name
    }
  }

  public convertTags(apiTags: Tag[] | undefined): string[] {
    const tags: string[] = [];
    if(apiTags) {
      apiTags.forEach((tag) => {
        if(tag.tagId) {
          const apiId = this.toApiId(ep.TAGS_ENDPOINT, tag.tagId);
          if(apiId) {
            tags.push(apiId);
          }
        }
      });
    }
    return tags;
  }

  public convertIngredient(apiIngredient: Ingredient | null | undefined): IngredientJsonld {
    if (!apiIngredient) {
      return {};
    }
    return {
      ingredientId: apiIngredient.ingredientId,
      name: apiIngredient.name
    }
  }

  private toApiId(prefix: string, id: number | string | null | undefined): string | undefined {
    if (!id) {
      return undefined;
    }
    return prefix + "/" + id;
  }

  public convertRecipeIngredient(viewModelIngredient: RecipeIngredient, recipeId?: string): RecipeIngredientJsonld {
    return {
      recipeIngredientId: viewModelIngredient.recipeIngredientId,
      ingredient: this.toApiId(ep.INGREDIENTS_ENDPOINT, viewModelIngredient.ingredient?.ingredientId),
      unit: viewModelIngredient.unit,
      quantity: viewModelIngredient.quantity,
      order: viewModelIngredient.order,
      recipe: (recipeId) ? this.toApiId(ep.RECIPES_ENDPOINT, recipeId) : undefined
    }
  }

  public convertRecipeIngredients(viewModelIngredients?: RecipeIngredient[], recipeId?: string): RecipeIngredientJsonld[] {
    if (!viewModelIngredients) {
      return []
    }
    const ingredients: RecipeIngredientJsonld[] = []
    viewModelIngredients.forEach((viewModelIngredient) => {
      if (viewModelIngredient.ingredient?.ingredientId) {
        ingredients.push(this.convertRecipeIngredient(viewModelIngredient, recipeId))
      }
    })
    return ingredients
  }

  public convertRecipe(apiRecipe: Recipe): RecipeJsonld {
    const imageIds: string[] = [];
    apiRecipe.images.forEach((image) => {
      const apiId = this.toApiId(ep.MEDIA_OBJECTS_ENDPOINT, image.mediaObjectId);
      if(apiId) {
        imageIds.push(apiId);
      }
    });

    return {
      recipeId: apiRecipe.recipeId,
      name: apiRecipe.name,
      description: apiRecipe.description,
      servings: apiRecipe.servings,
      source: apiRecipe.source,
      dateAdded: apiRecipe.dateAdded,
      images: imageIds,
      ingredients: this.convertRecipeIngredients(apiRecipe.ingredients, apiRecipe.recipeId?.toString()),
      tags: this.convertTags(apiRecipe.tags)
    }
  }

}