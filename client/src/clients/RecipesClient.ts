import { Recipe } from '../types'
import { AxiosError } from 'axios'
import { RecipeApi } from '../../rest/api'
import { clientConfiguration } from './clientConfiguration'
import { ToViewModelConverter } from './ToViewModelconverter'
import { ToRestModelConverter } from './ToRestModelConverter'
import { logAxiosError } from './axiosErrorLogger';

export class RecipesClient {
    client = new RecipeApi(clientConfiguration);
    toViewModelConverter = new ToViewModelConverter();
    toRestModelConverter = new ToRestModelConverter();

    public async getRecipes (): Promise<Recipe[]> {
      const ret = await this.client.getRecipeCollection()
      const apiRecipes = ret.data['hydra:member']

      const recipes: Recipe[] = []
      apiRecipes.forEach((apiRecipe) => {
        recipes.push(this.toViewModelConverter.convertRecipe(apiRecipe))
      })

      return recipes
    }

    public async saveRecipe(recipe: Recipe): Promise<Recipe> {
      const restRecipe = this.toRestModelConverter.convertRecipe(recipe);
      console.log("saving recipe", restRecipe);
      return new Promise<Recipe>((resolve, reject) => {
        this.client.postRecipeCollection(restRecipe)
        .then((ret) => {
          resolve(this.toViewModelConverter.convertRecipe(ret['data']));
        })
        .catch((e: AxiosError) => {
          logAxiosError(e);
          reject(e);
        });
      });
    }
}
