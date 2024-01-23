import { IngredientsClient } from "../clients/IngredientsClient";
import { createModule, mutation, action } from "vuex-class-component";
import { Ingredient } from "../types";

const VuexModule = createModule({
  namespaced: "ingredients",
  strict: false,
});

export class IngredientStore extends VuexModule {
  private ingredientClient = new IngredientsClient();

  public isInitialized = false;
  private initPromise : Promise<Ingredient[]> | null = null;

  public ingredients: Ingredient[] = [];
  public ingredientMap: Map<number, Ingredient> = new Map<number, Ingredient>();

  @action
  async init() {
    const initPromise = this.ingredientClient.getIngredients();
    this.SET_INIT_PROMISE(initPromise);

    return new Promise<void>((resolve, reject) => {
      initPromise
        .then((ingredients) => {
          const ingredientMap = new Map<number, Ingredient>();
          ingredients.forEach((ingredient) => {
            if (ingredient.ingredientId && ingredient.name) {
              ingredientMap.set(ingredient.ingredientId, ingredient);
            }
          });
      
          this.SET_INGREDIENTS(ingredients);
          this.SET_INGREDIENTS_MAP(ingredientMap);
          this.SET_IS_INITIALIZED(true);
          resolve();
        })
        .catch((err) => reject(err));
    });
  }

  @action
  async awaitInit(): Promise<void> {
    if (this.isInitialized) {
      return Promise.resolve();
    }
    else if (this.initPromise) {
      await this.initPromise;
      return Promise.resolve();
    }
    return Promise.reject("IngredientStore is not initialized");
  }

  @action
  async addIngredient(ingredientName: string): Promise<Ingredient> {
    // check if an ingredient with that name already exists
    // FIXME: this is a beautiful race condition and cannot deal with multiple clients adding ingredients
    // eventually this code should be moved to the backend with more sophisticated logic
    const existingIngredient = this.ingredients.find((ingredient) => {
      return ingredient.name?.trim() === ingredientName.trim();
    });
    if (existingIngredient) {
      return existingIngredient;
    }

    const ingredient = await this.ingredientClient.createIngredient(
      ingredientName
    );
    this.ADD_INGREDIENT(ingredient);
    return ingredient;
  }

  @action
  async removeIngredient(ingredientId: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.ingredientClient
        .deleteIngredient(ingredientId)
        .then(() => {
          this.REMOVE_INGREDIENT(ingredientId);
          resolve();
        })
        .catch((err) => reject(err));
    });
  }

  @mutation
  private SET_INIT_PROMISE(initPromise: Promise<Ingredient[]>) {
    this.initPromise = initPromise;
  }

  @mutation
  private SET_IS_INITIALIZED(isInitialized: boolean) {
    this.isInitialized = isInitialized;
  }

  @mutation
  private SET_INGREDIENTS(ingredients: Ingredient[]): void {
    this.ingredients = ingredients;
  }

  @mutation
  private SET_INGREDIENTS_MAP(ingredientsMap: Map<number, Ingredient>): void {
    this.ingredientMap = ingredientsMap;
  }

  @mutation
  private ADD_INGREDIENT(ingredient: Ingredient): void {
    if (ingredient.ingredientId && ingredient.name) {
      this.ingredients.push(ingredient);
      this.ingredientMap.set(ingredient.ingredientId, ingredient);
    }
  }

  @mutation
  private REMOVE_INGREDIENT(ingredientId: number): void {
    const ingredientToRemove = this.ingredientMap.get(ingredientId);
    if (ingredientToRemove) {
      this.ingredientMap.delete(ingredientId);
      this.ingredients.splice(this.ingredients.indexOf(ingredientToRemove), 1);
    }
  }
}

export default IngredientStore;
