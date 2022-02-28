import { RecipeJsonld, TagJsonld, ImageJsonld, IngredientJsonld, RecipeIngredientJsonld } from '../../rest/models'
import { Recipe, Tag, Image, Ingredient, RecipeIngredient } from '../types'

export class ToViewModelConverter {
  public convertTag (apiTag: TagJsonld): Tag {
    return {
      tagId: apiTag.tagId,
      name: apiTag.name
    }
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
      uuid: ''
    }
  }
  
  public convertRecipeIngredients (apiIngredients?: RecipeIngredientJsonld[]): RecipeIngredient[] {
    if (!apiIngredients) {
      return []
    }
    const ingredients: RecipeIngredient[] = []
    apiIngredients.forEach((apiIngredient) => {
      ingredients.push(this.convertRecipeIngredient(apiIngredient))
    })
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
      tags: []
    }
  }
}
