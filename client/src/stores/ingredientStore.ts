import { IngredientsClient } from "../clients/IngredientsClient";
import { createModule, mutation, action } from "vuex-class-component";
import { Ingredient } from "../types";

const VuexModule = createModule({
  namespaced: "ingredients",
  strict: false,
})

export class IngredientStore extends VuexModule {
  private ingredientClient = new IngredientsClient();

  public ingredients: Ingredient[] = [];
  public ingredientMap: Map<number, string> = new Map<number, string>();

  @action
  async init() {
    const ingredients = await this.ingredientClient.getIngredients();

    const ingredientMap = new Map<number, string>();
    ingredients.forEach((ingredient) => {
      if(ingredient.ingredientId && ingredient.name) {
        ingredientMap.set(ingredient.ingredientId, ingredient.name);
      }
    });

    this.SET_INGREDIENTS(ingredients);
    this.SET_INGREDIENTS_MAP(ingredientMap);
  }

  @action
  async addIngredient(ingredientName: string): Promise<Ingredient> {
    const ingredient = await this.ingredientClient.createIngredient(ingredientName);
    this.ADD_INGREDIENT(ingredient);
    return ingredient;
  }

  @mutation
  private SET_INGREDIENTS(ingredients: Ingredient[]): void {
    this.ingredients = ingredients;
  }

  @mutation
  private SET_INGREDIENTS_MAP(ingredientsMap: Map<number, string>): void {
    this.ingredientMap = ingredientsMap;
  }

  @mutation
  private ADD_INGREDIENT(ingredient: Ingredient): void {
    if(ingredient.ingredientId && ingredient.name) {
      this.ingredients.push(ingredient);
      this.ingredientMap.set(ingredient.ingredientId, ingredient.name);
    }
  }
}

export default IngredientStore;
