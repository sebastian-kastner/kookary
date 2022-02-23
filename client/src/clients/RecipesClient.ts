import { Recipe } from '../types'
import { RecipesApi } from '../../rest/api'
import { clientConfiguration } from './clientConfiguration'
import { convertRecipe } from './converter'

export class RecipesClient {
    client: RecipesApi = new RecipesApi(clientConfiguration);

    public async getRecipes (): Promise<Recipe[]> {
      const ret = await this.client.getRecipesCollection()
      const apiRecipes = ret.data['hydra:member']

      const recipes: Recipe[] = []
      apiRecipes.forEach((apiRecipe) => {
        recipes.push(convertRecipe(apiRecipe))
      })

      return recipes
    }
}
