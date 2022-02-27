import { Ingredient } from '../types'
import { IngredientsApi } from '../../rest/api'
import { clientConfiguration } from './clientConfiguration'
import { ToViewModelConverter } from './ToViewModelconverter'

export class IngredientsClient {
    client: IngredientsApi = new IngredientsApi(clientConfiguration);
    toViewModelConverter = new ToViewModelConverter();

    public async getIngredients (): Promise<Ingredient[]> {
      const ret = await this.client.getIngredientsCollection()
      const apiIngredients = ret.data['hydra:member']

      const ingredients: Ingredient[] = []
      apiIngredients.forEach((apiIngredient) => {
        ingredients.push(this.toViewModelConverter.convertIngredient(apiIngredient))
      })

      return ingredients
    }

    public async createIngredient(ingredientName: string): Promise<Ingredient> {
      const ret = await this.client.postIngredientsCollection({
        name: ingredientName
      });
      return this.toViewModelConverter.convertIngredient(ret.data);
    }
}
