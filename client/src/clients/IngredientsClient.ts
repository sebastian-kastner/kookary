import { Ingredient } from '../types'
import { IngredientsApi } from '../../rest/api'
import { clientConfiguration } from './clientConfiguration'
import { convertIngredient } from './converter'

export class IngredientsClient {
    client: IngredientsApi = new IngredientsApi(clientConfiguration);

    public async getIngredients (): Promise<Ingredient[]> {
      const ret = await this.client.getIngredientsCollection()
      const apiIngredients = ret.data['hydra:member']

      const ingredients: Ingredient[] = []
      apiIngredients.forEach((apiIngredient) => {
        ingredients.push(convertIngredient(apiIngredient))
      })

      return ingredients
    }
}
