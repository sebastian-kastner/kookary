import { Ingredient } from '../types'
import { IngredientApi } from '../../rest/api'
import { clientConfiguration } from './clientConfiguration'
import { ToViewModelConverter } from './ToViewModelConverter'

export class IngredientsClient {
    client: IngredientApi = new IngredientApi(clientConfiguration);
    toViewModelConverter = new ToViewModelConverter();

    public async getIngredients (): Promise<Ingredient[]> {
      const ret = await this.client.getIngredientCollection()
      const apiIngredients = ret.data['hydra:member']

      const ingredients: Ingredient[] = []
      apiIngredients.forEach((apiIngredient) => {
        ingredients.push(this.toViewModelConverter.convertIngredient(apiIngredient))
      })

      return ingredients
    }

    public async createIngredient(ingredientName: string): Promise<Ingredient> {
      const ret = await this.client.postIngredientCollection({
        name: ingredientName
      });
      return this.toViewModelConverter.convertIngredient(ret.data);
    }
}
