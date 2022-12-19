import { RecipeJsonld, TagJsonld, IngredientJsonld, RecipeIngredientJsonld, MediaObjectJsonldMediaObjectRead } from '../../rest/models'
import { Recipe, Tag, Ingredient, RecipeIngredient, MediaObject } from '../types'
import {v4 as uuid} from 'uuid';

export class ToViewModelConverter {
  public convertTag (apiTag: TagJsonld): Tag {
    return {
      tagId: apiTag.tagId,
      name: apiTag.name,
      authorId: this.toId(apiTag.author),
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
      name: apiIngredient.name,
      authorId: this.toId(apiIngredient.author),
    }
  }
  
  public convertRecipeIngredient (apiIngredient: RecipeIngredientJsonld): RecipeIngredient {
    return {
      recipeIngredientId: apiIngredient.recipeIngredientId,
      // FIXME does this work?
      ingredient: this.convertIngredient(apiIngredient.ingredient as IngredientJsonld),
      quantity: apiIngredient.quantity,
      unit: apiIngredient.unit,
      position: apiIngredient.position,
      uuid: uuid(),
    }
  }
  
  public convertRecipeIngredients (apiIngredients?: RecipeIngredientJsonld[]): RecipeIngredient[] {
    if (!apiIngredients) {
      return [];
    }
    const ingredients: RecipeIngredient[] = [];
    // not using forEach here because in for some reason apiIngredients is an object after a save operation
    for (const key in apiIngredients) {
      ingredients.push(this.convertRecipeIngredient(apiIngredients[key]))
    }

    ingredients.sort((a, b) => {
      let aPos = 0;
      let bPos = 0;

      if (a.position) {
        aPos = a.position;
      } else if (a.recipeIngredientId) {
        aPos = a.recipeIngredientId;
      }

      if (b.position) {
        bPos = b.position;
      } else if (b.recipeIngredientId) {
        bPos = b.recipeIngredientId;
      }
      
      return aPos - bPos;
    })

    return ingredients;
  }
  
  public convertRecipe (apiRecipe: RecipeJsonld): Recipe {
    const images: MediaObject[] = [];
    if (apiRecipe.images) {
      apiRecipe.images.forEach((image) => {
        if (image) {
          images.push({
            mediaObjectId: this.toId(image)
          });
        }
      });
    }
    
    const authorId = this.toId(apiRecipe.author);
    return {
      recipeId: apiRecipe.recipeId,
      name: apiRecipe.name,
      images: images,
      description: apiRecipe.description,
      servings: apiRecipe.servings,
      source: this.getStringOrNull(apiRecipe.source),
      dateAdded: apiRecipe.dateAdded,
      ingredients: this.convertRecipeIngredients(apiRecipe.ingredients),
      tags: this.convertTags(apiRecipe.tags),
      marked: this.getBoolean(apiRecipe.marked),
      imagesToDelete: [],
      authorId: (authorId ? authorId : null),
    }
  }

  public convertMediaObject (apiMediaObject: MediaObjectJsonldMediaObjectRead): MediaObject {
    let url;
    if (apiMediaObject.contentUrl) {
      url = process.env.VUE_APP_ROOT_API + apiMediaObject.contentUrl;
    }
    return {
      mediaObjectId: this.toId(apiMediaObject['@id']),
      url: url,
      authorId: this.toId(apiMediaObject.author),
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

  private toId(iri: string | null | undefined): number | undefined {
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
