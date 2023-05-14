import { IngredientCategory } from "../types";
import { IngredientCategoryApi } from "../../rest/api";
import { clientConfiguration } from "./clientConfiguration";
import { convertIngredientCategory } from "./ToViewModelConverter";
import { logAxiosError } from "./axiosErrorLogger";

export class IngredientCategoriesClient {
  client = new IngredientCategoryApi(clientConfiguration);

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
            categories.push(convertIngredientCategory(category));
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
