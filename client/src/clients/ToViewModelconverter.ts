import { RecipeJsonld, TagJsonld, ImageJsonld, IngredientJsonld, RecipeIngredientJsonld } from '../../rest/models'
import { Recipe, Tag, Image, Ingredient, RecipeIngredient } from '../types'
import {v4 as uuid} from 'uuid';

export class ToViewModelConverter {
  public convertTag (apiTag: TagJsonld): Tag {
    return {
      tagId: apiTag.tagId,
      name: apiTag.name,
      uuid: uuid(),
    }
  }

  public convertTags(apiTags: string[] | undefined): Tag[] {
    const tags: Tag[] = [];
    if(apiTags) {
      apiTags.forEach((apiTag) => {
        tags.push({
          uuid: uuid(),
          tagId: this.toId(apiTag)
        });
      });
    }
    return tags;
  }

  private toId(iri: string): number | undefined {
    const stringId = iri.split("/").pop()?.toString();
    if(stringId) {
      const number = Number(stringId)
      if(!isNaN(number)) {
        return number;
      }
    }
    return undefined;
  }
  
  public convertImage (apiImage: ImageJsonld): Image {
    return {
      imageId: apiImage.imageId,
      date: apiImage.date,
      path: apiImage.path
    }
  }
  
  public convertIngredient (apiIngredient: IngredientJsonld): Ingredient {
    return {
      ingredientId: apiIngredient.ingredientId,
      name: apiIngredient.name
    }
  }
  
  public convertRecipeIngredient (apiIngredient: RecipeIngredientJsonld): RecipeIngredient {
    return {
      recipeIngredientId: apiIngredient.recipeIngredientId,
      // FIXME does this work?
      ingredient: this.convertIngredient(apiIngredient.ingredient as IngredientJsonld),
      quantity: apiIngredient.quantity,
      unit: apiIngredient.unit,
      uuid: uuid(),
    }
  }
  
  public convertRecipeIngredients (apiIngredients?: RecipeIngredientJsonld[]): RecipeIngredient[] {
    if (!apiIngredients) {
      return []
    }
    const ingredients: RecipeIngredient[] = []
    // not using forEach here because in for some reason apiIngredients is an object after a save operation
    for (const key in apiIngredients) {
      ingredients.push(this.convertRecipeIngredient(apiIngredients[key]))
    }
    return ingredients
  }
  
  public convertRecipe (apiRecipe: RecipeJsonld): Recipe {
    return {
      recipeId: apiRecipe.recipeId,
      name: apiRecipe.name,
      description: apiRecipe.description,
      servings: apiRecipe.servings,
      source: apiRecipe.source,
      rating: apiRecipe.rating,
      dateAdded: apiRecipe.dateAdded,
      // FIXME convert images
      images: [],
      ingredients: this.convertRecipeIngredients(apiRecipe.ingredients),
      // FIXME convert tags
      tags: this.convertTags(apiRecipe.tag)
    }
  }
}
