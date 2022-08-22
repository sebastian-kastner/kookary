import { RecipeJsonld, TagJsonld, IngredientJsonld, RecipeIngredientJsonld, MediaObjectJsonldMediaObjectRead } from '../../rest/models'
import { Recipe, Tag, Ingredient, RecipeIngredient, MediaObject } from '../types'
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
    return ingredients;
  }
  
  public convertRecipe (apiRecipe: RecipeJsonld): Recipe {
    if(apiRecipe.image) {
      console.log(apiRecipe.image);
    }
    return {
      recipeId: apiRecipe.recipeId,
      name: apiRecipe.name,
      // TODO convert image
      image: {
        mediaObjectId: apiRecipe.image
      },
      description: apiRecipe.description,
      servings: apiRecipe.servings,
      source: this.getStringOrNull(apiRecipe.source),
      dateAdded: apiRecipe.dateAdded,
      ingredients: this.convertRecipeIngredients(apiRecipe.ingredients),
      // FIXME convert tags
      tags: this.convertTags(apiRecipe.tag),
      marked: this.getBoolean(apiRecipe.marked),
    }
  }

  public convertMediaObject (apiMediaObject: MediaObjectJsonldMediaObjectRead): MediaObject {
    return {
      mediaObjectId: this.getStringOrNull(apiMediaObject['@id']),
      url: this.getStringOrNull(apiMediaObject.contentUrl)
    }
  }

  public convertMediaObjects (apiMediaObjects?: MediaObjectJsonldMediaObjectRead[]): MediaObject[] {
    if (!apiMediaObjects) {
      return []
    }
    const mediaObjects: MediaObject[] = []
    // not using forEach here because in for some reason apiIngredients is an object after a save operation
    for (const key in apiMediaObjects) {
      mediaObjects.push(this.convertMediaObject(apiMediaObjects[key]))
    }
    return mediaObjects;
  }

  private toId(iri: string | undefined): number | undefined {
    if (!iri) {
      return undefined;
    }
    const stringId = iri.split("/").pop()?.toString();
    if(stringId) {
      const number = Number(stringId)
      if(!isNaN(number)) {
        return number;
      }
    }
    return undefined;
  }

  private getStringOrNull(value: string | null | undefined): string | null {
    if(value) {
      return value;
    }
    return null;
  }

  private getBoolean(value: boolean | null | undefined): boolean {
    if (value) {
      return value;
    }
    return false;
  }

}
