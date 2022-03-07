import { Recipe } from '../types'
import { AxiosError, AxiosResponse } from 'axios'
import { RecipeApi } from '../../rest/api'
import { clientConfiguration } from './clientConfiguration'
import { ToViewModelConverter } from './ToViewModelconverter'
import { ToRestModelConverter } from './ToRestModelConverter'
import { logAxiosError } from './axiosErrorLogger';
import { RecipeJsonld } from 'rest/models'

export class RecipesClient {
    client = new RecipeApi(clientConfiguration);
    toViewModelConverter = new ToViewModelConverter();
    toRestModelConverter = new ToRestModelConverter();

    /**
     * 
     * @returns all recipes
     */
    public async getRecipes (): Promise<Recipe[]> {
      const ret = await this.client.getRecipeCollection()
      const apiRecipes = ret.data['hydra:member']

      const recipes: Recipe[] = []
      apiRecipes.forEach((apiRecipe) => {
        recipes.push(this.toViewModelConverter.convertRecipe(apiRecipe))
      })

      return recipes
    }

    /**
     * Gets the recipe with the given id
     * 
     * @param recipeId the id of the recipe to be fetched
     * @returns the recipe with the given id
     */
    // TODO what happens if the recipe does not exist?
    public async getRecipe(recipeId: string | number): Promise<Recipe> {
      const ret = await this.client.getRecipeItem(recipeId.toString());
      return this.toViewModelConverter.convertRecipe(ret.data);
    }

    /**
     * Saves the recipe if it does not have a recipeId yet or updates the given recipe if it does have a recipeId.
     * 
     * @param recipe the recipe to be saved/updated
     * @returns the saved recipe
     */
    public async saveRecipe(recipe: Recipe): Promise<Recipe> {
      const restRecipe = this.toRestModelConverter.convertRecipe(recipe);
      if(recipe.recipeId) {
        return this.saveInternal(this.client.patchRecipeItem(recipe.recipeId.toString(), restRecipe));
      }
      return this.saveInternal(this.client.postRecipeCollection(restRecipe));
    }

    // eslint-disable-next-line
    private async saveInternal(savePromise: Promise<AxiosResponse<RecipeJsonld, any>>) {
      return new Promise<Recipe>((resolve, reject) => {
        savePromise
          .then((ret) => {
            resolve(this.toViewModelConverter.convertRecipe(ret['data']));
          })
          .catch((e: AxiosError) => {
            logAxiosError(e);
            reject(e);
          });
      })
    }
}
