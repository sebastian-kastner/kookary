import { Recipe } from '../types'
import { AxiosError, AxiosResponse } from 'axios'
import { RecipeApi } from '../../rest/api'
import { clientConfiguration } from './clientConfiguration'
import { ToViewModelConverter } from './ToViewModelconverter'
import { ToRestModelConverter } from './ToRestModelConverter'
import { logAxiosError } from './axiosErrorLogger';
import { RecipeJsonld } from 'rest/models'
import { TagsClient } from './TagsClient'

export class RecipesClient {
    client = new RecipeApi(clientConfiguration);
    tagsClient = new TagsClient();

    toViewModelConverter = new ToViewModelConverter();
    toRestModelConverter = new ToRestModelConverter();

    /**
     * 
     * @returns all recipes
     */
    public async getRecipes (filter?: RecipeFilter): Promise<Recipe[]> {
      let page = 1;
      if (filter?.page) {
        page = filter.page;
      }
      const ret = await this.client.getRecipeCollection(page, filter?.nameContains, filter?.withIngredient);
      
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
      const recipe = this.toViewModelConverter.convertRecipe(ret.data);
      // manually resolve tag names
      const tags = await this.tagsClient.getTagNameMap();
      recipe.tags?.forEach((tag) => {
        if(tag.tagId) {
          const tagName = tags.get(tag.tagId);
          if(tagName) {
            tag.name = tagName;
          }
        }
      });
      return recipe;
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

export type RecipeFilter = {
  page?: number,
  withIngredient?: number,
  nameContains?: string,
}