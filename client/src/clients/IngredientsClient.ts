import { Ingredient } from '../types'
import { IngredientApi } from '../../rest/api'
import { clientConfiguration } from './clientConfiguration'
import { ToViewModelConverter } from './ToViewModelConverter'
import { toIri } from './ToRestModelConverter'
import { userStore } from '../stores/rootStore'
import { USER_ENDPOINT } from './endpoints'

export class IngredientsClient {
  client: IngredientApi = new IngredientApi(clientConfiguration);
  toViewModelConverter = new ToViewModelConverter();

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
            resolve(this.toViewModelConverter.convertTag(response.data));
          })
          .catch((e) => reject(e));
      } else {
        reject("Cannot create ingredient, no logged in user!")
      }
    });
  }
}
