import {
  RecipeJsonld, TagJsonld, IngredientJsonld, RecipeIngredientJsonld, MediaObjectJsonldMediaObjectRead,
  UserJsonldRead, IngredientCategoryJsonld, CookupJsonld, ShoppingItemJsonld
} from '../../rest/models'
import { Recipe, Tag, Ingredient, RecipeIngredient, MediaObject, User, IngredientCategory, Cookup, ShoppingItem } from '../types'
import { v4 as uuid } from 'uuid';

export function toId(iri: string | null | undefined): number | undefined {
  if (!iri) {
    return undefined;
  }
  const stringId = iri.split("/").pop()?.toString();
  if (stringId) {
    const number = Number(stringId)
    if (!isNaN(number)) {
      return number;
    }
  }
  return undefined;
}

export class ToViewModelConverter {
  public convertTag(apiTag: TagJsonld): Tag {
    return {
      tagId: apiTag.tagId,
      name: apiTag.name,
      authorId: toId(apiTag.author),
      uuid: uuid(),
    }
  }

  public convertTags(apiTags: string[] | undefined): Tag[] {
    const tags: Tag[] = [];
    if (apiTags) {
      apiTags.forEach((apiTag) => {
        tags.push({
          uuid: uuid(),
          tagId: toId(apiTag)
        });
      });
    }
    return tags;
  }

  public convertIngredient(apiIngredient: IngredientJsonld): Ingredient {
    return {
      ingredientId: apiIngredient.ingredientId,
      name: apiIngredient.name,
      authorId: toId(apiIngredient.author),
      seasonStart: apiIngredient.seasonStart,
      seasonEnd: apiIngredient.seasonEnd,
      ingredientCategoryId: toId(apiIngredient.category)
    }
  }

  public convertIngredientCategory(apiCategory: IngredientCategoryJsonld): IngredientCategory {
    return {
      ingredientCategoryId: apiCategory.categoryId,
      name: apiCategory.name,
      order: apiCategory.order,
    }
  }

  public convertRecipeIngredient(apiIngredient: RecipeIngredientJsonld): RecipeIngredient {
    return {
      recipeIngredientId: apiIngredient.recipeIngredientId,
      ingredient: this.convertIngredient(apiIngredient.ingredient as IngredientJsonld),
      quantity: apiIngredient.quantity,
      unit: apiIngredient.unit,
      position: apiIngredient.position,
      uuid: uuid(),
    }
  }

  public convertRecipeIngredients(apiIngredients?: RecipeIngredientJsonld[]): RecipeIngredient[] {
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

  public convertRecipe(apiRecipe: RecipeJsonld): Recipe {
    const images: MediaObject[] = [];
    if (apiRecipe.images) {
      apiRecipe.images.forEach((image) => {
        if (image) {
          images.push({
            mediaObjectId: toId(image)
          });
        }
      });
    }

    const authorId = toId(apiRecipe.author);
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
      imagesToDelete: [],
      authorId: (authorId ? authorId : null),
    }
  }

  public convertMediaObject(apiMediaObject: MediaObjectJsonldMediaObjectRead): MediaObject {
    let url;
    if (apiMediaObject.contentUrl) {
      url = process.env.VUE_APP_ROOT_API + apiMediaObject.contentUrl;
    }
    return {
      mediaObjectId: toId(apiMediaObject['@id']),
      url: url,
      authorId: toId(apiMediaObject.author),
    }
  }

  public convertMediaObjects(apiMediaObjects?: MediaObjectJsonldMediaObjectRead[]): MediaObject[] {
    if (!apiMediaObjects) {
      return []
    }
    const mediaObjects: MediaObject[] = []
    // not using forEach here because for some reason apiIngredients is an object after a save operation
    for (const key in apiMediaObjects) {
      mediaObjects.push(this.convertMediaObject(apiMediaObjects[key]))
    }
    return mediaObjects;
  }

  public convertUser(apiUser: UserJsonldRead): User {
    const roles: Set<string> = new Set();
    if (apiUser.roles) {
      apiUser.roles.forEach((role) => {
        roles.add(role);
      });
    }

    return {
      displayName: apiUser.displayname,
      email: apiUser.email,
      id: apiUser.id,
      roles: roles,
    }
  }

  public convertUsers(apiUsers?: UserJsonldRead[]): User[] {
    if (!apiUsers) {
      return [];
    }

    const users: User[] = [];
    for (const key in apiUsers) {
      users.push(this.convertUser(apiUsers[key]));
    }
    return users;
  }

  public convertShoppingItem(shoppingItem: ShoppingItemJsonld): ShoppingItem {
    return {
      shoppingItemId: shoppingItem.shoppingItemId,
      name: shoppingItem.name,
      user: toId(shoppingItem.user),
      done: shoppingItem.done,
      ingredientId: toId(shoppingItem.ingredient), // TODO: use real ingredient here..
      quantity: shoppingItem.quantity,
      unit: shoppingItem.unit,
    }
  }

  public convertShoppingItems(apiItems: ShoppingItemJsonld[]): ShoppingItem[] {
    const items: ShoppingItem[] = [];
    apiItems.forEach(cookup => {
      items.push(this.convertShoppingItem(cookup));
    });
    return items;
  }

  public convertCookup(cookup: CookupJsonld): Cookup {
    return {
      cookupId: cookup.cookupId,
      userId: toId(cookup.user),
      recipeId: toId(cookup.recipe),
      date: cookup.date,
    }
  }

  public convertCookups(apiCookups: CookupJsonld[]): Cookup[] {
    const cookups: Cookup[] = [];
    apiCookups.forEach(cookup => {
      cookups.push(this.convertCookup(cookup));
    });
    return cookups;
  }

  private getStringOrNull(value: string | null | undefined): string | null {
    if (value) {
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
