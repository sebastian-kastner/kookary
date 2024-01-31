import {
  RecipeJsonld,
  TagJsonld,
  IngredientJsonld,
  RecipeIngredientJsonld,
  MediaObjectJsonldMediaObjectRead,
  UserJsonldRead,
  IngredientCategoryJsonld,
  CookupJsonld,
  ShoppingItemJsonld,
} from "../../rest/models";
import {
  Recipe,
  Tag,
  Ingredient,
  RecipeIngredient,
  MediaObject,
  User,
  IngredientCategory,
  Cookup,
  ShoppingItem,
} from "../types";
import { v4 as uuid } from "uuid";

export function toId(iri: string | null | undefined): number | undefined {
  if (!iri) {
    return undefined;
  }
  const stringId = iri.split("/").pop()?.toString();
  if (stringId) {
    const number = Number(stringId);
    if (!isNaN(number)) {
      return number;
    }
  }
  return undefined;
}

export function convertTag(apiTag: TagJsonld): Tag {
  return {
    tagId: apiTag.tagId,
    name: apiTag.name,
    authorId: toId(apiTag.author),
    uuid: uuid(),
  };
}

export function convertTags(apiTags: string[] | undefined): Tag[] {
  const tags: Tag[] = [];
  if (apiTags) {
    apiTags.forEach((apiTag) => {
      tags.push({
        uuid: uuid(),
        tagId: toId(apiTag),
      });
    });
  }
  return tags;
}

export function convertIngredient(apiIngredient: IngredientJsonld): Ingredient | null {
  if (!apiIngredient) {
    return null;
  }
  return {
    uuid: uuid(),
    ingredientId: apiIngredient.ingredientId,
    name: apiIngredient.name,
    authorId: toId(apiIngredient.author),
    seasonStart: apiIngredient.seasonStart,
    seasonEnd: apiIngredient.seasonEnd,
    ingredientCategoryId: toId(apiIngredient.category),
  };
}

export function convertIngredientCategory(
  apiCategory: IngredientCategoryJsonld
): IngredientCategory {
  return {
    ingredientCategoryId: apiCategory.categoryId,
    name: apiCategory.name,
    order: apiCategory.order,
    isDefault: apiCategory.isDefaultCategory,
  };
}

export function convertRecipeIngredient(
  apiIngredient: RecipeIngredientJsonld
): RecipeIngredient {
  return {
    recipeIngredientId: apiIngredient.recipeIngredientId,
    ingredient: convertIngredient(apiIngredient.ingredient as IngredientJsonld),
    separatorLabel: apiIngredient.separatorLabel,
    quantity: apiIngredient.quantity,
    unit: apiIngredient.unit,
    position: apiIngredient.position,
    uuid: uuid(),
  };
}

export function convertRecipeIngredients(
  apiIngredients?: RecipeIngredientJsonld[]
): RecipeIngredient[] {
  if (!apiIngredients) {
    return [];
  }
  const ingredients: RecipeIngredient[] = [];
  // not using forEach here because in for some reason apiIngredients is an object after a save operation
  for (const key in apiIngredients) {
    ingredients.push(convertRecipeIngredient(apiIngredients[key]));
  }
  return ingredients;
}

export function convertRecipe(apiRecipe: RecipeJsonld): Recipe {
  const images: MediaObject[] = [];
  if (apiRecipe.images && apiRecipe.images.forEach) {
    apiRecipe.images.forEach((image) => {
      if (image) {
        images.push({
          mediaObjectId: toId(image),
        });
      }
    });
  }

  let servings: number | undefined = undefined;
  if (apiRecipe.servings && apiRecipe.servings > 0) {
    servings = apiRecipe.servings;
  }

  const authorId = toId(apiRecipe.author);
  return {
    recipeId: apiRecipe.recipeId,
    name: apiRecipe.name,
    images: images,
    description: apiRecipe.description,
    servings: servings,
    source: getStringOrNull(apiRecipe.source),
    dateAdded: apiRecipe.dateAdded,
    ingredients: convertRecipeIngredients(apiRecipe.ingredients),
    tags: convertTags(apiRecipe.tags),
    imagesToDelete: [],
    authorId: authorId ? authorId : null,
  };
}

export function convertMediaObject(
  apiMediaObject: MediaObjectJsonldMediaObjectRead
): MediaObject {
  let url;
  if (apiMediaObject.contentUrl) {
    url = import.meta.env.VITE_APP_ROOT_API + apiMediaObject.contentUrl;
  }
  return {
    mediaObjectId: toId(apiMediaObject["@id"]),
    url: url,
    authorId: toId(apiMediaObject.author),
  };
}

export function convertMediaObjects(
  apiMediaObjects?: MediaObjectJsonldMediaObjectRead[]
): MediaObject[] {
  if (!apiMediaObjects) {
    return [];
  }
  const mediaObjects: MediaObject[] = [];
  // not using forEach here because for some reason apiIngredients is an object after a save operation
  for (const key in apiMediaObjects) {
    mediaObjects.push(convertMediaObject(apiMediaObjects[key]));
  }
  return mediaObjects;
}

export function convertUser(apiUser: UserJsonldRead): User {
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
  };
}

export function convertUsers(apiUsers?: UserJsonldRead[]): User[] {
  if (!apiUsers) {
    return [];
  }

  const users: User[] = [];
  for (const key in apiUsers) {
    users.push(convertUser(apiUsers[key]));
  }
  return users;
}

export function convertShoppingItem(
  shoppingItem: ShoppingItemJsonld
): ShoppingItem {
  return {
    shoppingItemId: shoppingItem.shoppingItemId,
    name: shoppingItem.name,
    user: toId(shoppingItem.user),
    done: shoppingItem.done,
    ingredientId: toId(shoppingItem.ingredient),
    quantity: shoppingItem.quantity,
    unit: shoppingItem.unit,
  };
}

export function convertShoppingItems(
  apiItems: ShoppingItemJsonld[]
): ShoppingItem[] {
  const items: ShoppingItem[] = [];
  apiItems.forEach((cookup) => {
    items.push(convertShoppingItem(cookup));
  });
  return items;
}

export function convertCookup(cookup: CookupJsonld): Cookup {
  return {
    cookupId: cookup.cookupId,
    userId: toId(cookup.user),
    recipeId: toId(cookup.recipe),
    date: cookup.date,
  };
}

export function convertCookups(apiCookups: CookupJsonld[]): Cookup[] {
  const cookups: Cookup[] = [];
  apiCookups.forEach((cookup) => {
    cookups.push(convertCookup(cookup));
  });
  return cookups;
}

function getStringOrNull(value: string | null | undefined): string | null {
  if (value) {
    return value;
  }
  return null;
}
