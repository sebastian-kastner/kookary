import { RecipeJsonld, TagJsonld, IngredientJsonld, RecipeIngredientJsonld, UserWrite } from '../../rest/models'
import { Recipe, Tag, Ingredient, RecipeIngredient, User } from '../types'
import { userStore } from '../stores/rootStore'
import * as ep from './endpoints'

export function toIri(prefix: string, id: number | string): string {
  return prefix + "/" + id;
}
export class ToRestModelConverter {

  public convertTag(apiTag: Tag): TagJsonld {
    return {
      tagId: apiTag.tagId,
      name: apiTag.name,
      author: this.getAuthorId(apiTag.authorId),
    }
  }

  public convertTags(apiTags: Tag[] | undefined): string[] {
    const tags: string[] = [];
    if (apiTags) {
      apiTags.forEach((tag) => {
        if (tag.tagId) {
          const apiId = this.toApiId(ep.TAGS_ENDPOINT, tag.tagId);
          if (apiId) {
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
      name: apiIngredient.name,
      author: this.getAuthorId(apiIngredient.authorId),
      category: this.toApiId(ep.INGREDIENT_CATEGORY_ENDPOINT, apiIngredient.ingredientCategoryId),
    }
  }

  public convertRecipeIngredient(viewModelIngredient: RecipeIngredient, recipeId?: string): RecipeIngredientJsonld {
    return {
      recipeIngredientId: viewModelIngredient.recipeIngredientId,
      ingredient: this.toApiId(ep.INGREDIENTS_ENDPOINT, viewModelIngredient.ingredient?.ingredientId),
      unit: viewModelIngredient.unit,
      quantity: viewModelIngredient.quantity,
      position: viewModelIngredient.position,
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
      if (apiId) {
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
      tags: this.convertTags(apiRecipe.tags),
      author: this.getAuthorId(apiRecipe.authorId),
    }
  }

  public convertUserWrite(apiUser: User): UserWrite {
    let roles: string[] | undefined;
    if (apiUser.roles) {
      roles = Array.from(apiUser.roles);
    }
    return {
      id: apiUser.id,
      displayname: apiUser.displayName,
      email: apiUser.email,
      roles: roles,
    }
  }

  private getAuthorId(authorId: number | undefined | null): string {
    if (authorId) {
      return ep.USER_ENDPOINT + "/" + authorId;
    }

    const user = userStore.user;
    if (!user || !user.id) {
      throw new Error("No authorId set and no logged in user found!")
    }

    return ep.USER_ENDPOINT + "/" + user.id;
  }

  private toApiId(prefix: string, id: number | string | null | undefined): string | undefined {
    if (!id) {
      return undefined;
    }
    return prefix + "/" + id;
  }
}