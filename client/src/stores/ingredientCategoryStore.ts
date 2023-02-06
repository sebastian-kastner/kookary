import { IngredientCategoriesClient } from "../clients/IngredientCategoriesClient";
import { createModule, mutation, action } from "vuex-class-component";
import { IngredientCategory } from "../types";

const VuexModule = createModule({
  namespaced: "ingredientCategories",
  strict: false,
})

export class IngredientCategoryStore extends VuexModule {
  private client = new IngredientCategoriesClient();

  public categories: IngredientCategory[] = [];
  public categoriesMap: Map<number, IngredientCategory> = new Map<number, IngredientCategory>();

  @action
  async init() {
    const categories = await this.client.getIngredientCategories();

    const categoryMap = new Map<number, IngredientCategory>();
    categories.forEach((category) => {
      if(category.ingredientCategoryId && category.name) {
        categoryMap.set(category.ingredientCategoryId, category);
      }
    });

    this.SET_CATEGORIES(categories);
    this.SET_CATEGORY_MAP(categoryMap);
  }

  @mutation
  private SET_CATEGORIES(tags: IngredientCategory[]): void {
    this.categories = tags;
  }

  @mutation
  private SET_CATEGORY_MAP(tagsMap: Map<number, IngredientCategory>): void {
    this.categoriesMap = tagsMap;
  }
}

export default IngredientCategoryStore;
