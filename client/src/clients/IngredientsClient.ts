import { Ingredient } from '../types'
import { IngredientApi } from '../../rest/api'
import { clientConfiguration } from './clientConfiguration'
import { ToViewModelConverter } from './ToViewModelConverter'
import { ToRestModelConverter } from './ToRestModelConverter'
import { toIri } from './ToRestModelConverter'
import { userStore } from '../stores/rootStore'
import { USER_ENDPOINT } from './endpoints'
import { logAxiosError } from './axiosErrorLogger';

export class IngredientsClient {
  client: IngredientApi = new IngredientApi(clientConfiguration);

  toViewModelConverter = new ToViewModelConverter();
  toRestModelConverter = new ToRestModelConverter(); 

  public async getIngredients(): Promise<Ingredient[]> {
    const ret = await this.client.getIngredientCollection();
    const apiIngredients = ret.data['hydra:member'];

    const ingredients: Ingredient[] = [];
    apiIngredients.forEach((apiIngredient) => {
      ingredients.push(this.toViewModelConverter.convertIngredient(apiIngredient));
    })

    return ingredients;
  }

  public async createIngredient(ingredientName: string): Promise<Ingredient> {
    const user = userStore.user;
    return new Promise<Ingredient>((resolve, reject) => {
      if (user && user.id) {
        this.client.postIngredientCollection({
          name: ingredientName,
          author: toIri(USER_ENDPOINT, user.id),
        })
          .then((response) => {
            resolve(this.toViewModelConverter.convertIngredient(response.data));
          })
          .catch((e) => reject(e));
      } else {
        reject("Cannot create ingredient, no logged in user!")
      }
    });
  }

  public async updateIngredient(ingredient: Ingredient): Promise<void> {
    const apiIngredient = this.toRestModelConverter.convertIngredient(ingredient);
    return new Promise<void>((resolve, reject) => {
      if (!ingredient.ingredientId) {
        reject("Ingredient needs to be set!");
        return;
      }
      const apiId = ingredient.ingredientId.toString();

      this.client.patchIngredientItem(apiId, apiIngredient)
        .then(() => { resolve() })
        .catch((err) => {
          logAxiosError(err);
          reject(err);
        })
    });
  }
}
