import { RecipesJsonld, TagsJsonld, ImagesJsonld, IngredientsJsonld, RecipeIngredientJsonld } from '../../rest/models'
import { Recipe, Tag, Image, Ingredient, RecipeIngredient } from '../types'

export function convertTag (apiTag: TagsJsonld): Tag {
  return {
    tagId: apiTag.tagId,
    name: apiTag.name
  }
}

export function convertImage (apiImage: ImagesJsonld): Image {
  return {
    imageId: apiImage.imageId,
    date: apiImage.date,
    path: apiImage.path
  }
}

export function convertIngredient (apiIngredient: IngredientsJsonld): Ingredient {
  return {
    ingredientId: apiIngredient.ingredientId,
    name: apiIngredient.name
  }
}

export function convertRecipeIngredient (apiIngredient: RecipeIngredientJsonld): RecipeIngredient {
  return {
    ingredientId: apiIngredient.ingredientId,
    // FIXME does this work?
    ingredient: convertIngredient(apiIngredient.ingredient as IngredientsJsonld),
    recipeId: apiIngredient.recipe,
    amount: apiIngredient.amount,
    unit: apiIngredient.unit
  }
}

export function convertRecipeIngredients (apiIngredients?: RecipeIngredientJsonld[]): RecipeIngredient[] {
  if (!apiIngredients) {
    return []
  }
  const ingredients: RecipeIngredient[] = []
  apiIngredients.forEach((apiIngredient) => {
    ingredients.push(convertRecipeIngredient(apiIngredient))
  })
  return ingredients
}

export function convertRecipe (apiRecipe: RecipesJsonld): Recipe {
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
    images: [],
    recipeIngredients: convertRecipeIngredients(apiRecipe.recipeIngredients),
    // FIXME convert tags
    tags: []
  }
}
