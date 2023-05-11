import { IngredientCategory } from "../types";
import { IngredientCategoryApi } from "../../rest/api";
import { clientConfiguration } from "./clientConfiguration";
import { ToViewModelConverter } from "./ToViewModelConverter";
import { ToRestModelConverter } from "./ToRestModelConverter";
import { logAxiosError } from "./axiosErrorLogger";

export class IngredientCategoriesClient {
  client = new IngredientCategoryApi(clientConfiguration);
  toViewModelConverter = new ToViewModelConverter();
  toRestModelConverter = new ToRestModelConverter();

  /**
   *
   * @returns all ingredient categories
   */
  public async getIngredientCategories(): Promise<IngredientCategory[]> {
    return new Promise<IngredientCategory[]>((resolve, reject) => {
      this.client
        .getIngredientCategoryCollection()
        .then((response) => {
          const restCategories = response.data["hydra:member"];
          const categories: IngredientCategory[] = [];
          restCategories.forEach((category) => {
            categories.push(
              this.toViewModelConverter.convertIngredientCategory(category)
            );
          });
          resolve(categories);
        })
        .catch((error) => {
          logAxiosError(error);
          reject(error);
        });
    });
  }
}
