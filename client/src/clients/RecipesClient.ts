import { Ingredient, Recipe, Tag } from '../types'
import { AxiosError, AxiosResponse } from 'axios'
import { RecipeApi } from '../../rest/api'
import { clientConfiguration } from './clientConfiguration'
import { ToViewModelConverter } from './ToViewModelConverter'
import { ToRestModelConverter } from './ToRestModelConverter'
import { logAxiosError } from './axiosErrorLogger';
import { RecipeJsonld } from 'rest/models'
import { tagStore } from '../stores/rootStore'

export class RecipesClient {
    client = new RecipeApi(clientConfiguration);

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

      // FIXME this only works for a single ingredient now
      let ingredientFilter: string | undefined;
      if(filter?.ingredients) {
        const ingredients = filter.ingredients;
        if(ingredients.length > 0) {
          ingredientFilter = ingredients[0].ingredientId?.toString();
        }
      }
      let tagFilter: string | undefined;
      if(filter?.tags) {
        const tags = filter.tags;
        if(tags.length > 0) {
          tagFilter = tags[0].tagId?.toString();
        }
      }
      let isSeasonal = false;
      if(filter?.isSeasonal === true) {
        isSeasonal = true;
      }

      let isMarked = undefined;
      if(filter?.marked !== null && filter?.marked !== undefined) {
        isMarked = filter.marked;
      }

      const getPromise = this.client.getRecipeCollection(
        page,
        ingredientFilter,
        tagFilter,
        isSeasonal,
        filter?.nameContains,
        isMarked
      );

      return new Promise<Recipe[]>((resolve, reject) => {
        getPromise
          .then((ret) => {
            const apiRecipes = ret.data['hydra:member']
            const recipes: Recipe[] = []
            apiRecipes.forEach((apiRecipe) => {
              recipes.push(this.toViewModelConverter.convertRecipe(apiRecipe))
            })
            resolve(recipes);
          })
          .catch((e: AxiosError) => {
            logAxiosError(e);
            reject(e);
          });
      })
    }

    /**
     * Gets the recipe with the given id
     * 
     * @param recipeId the id of the recipe to be fetched
     * @returns the recipe with the given id
     */
    public async getRecipe(recipeId: string | number): Promise<Recipe> {
      const ret = await this.client.getRecipeItem(recipeId.toString());
      const recipe = this.toViewModelConverter.convertRecipe(ret.data);
      // manually resolve tag names
      const tags = tagStore.tagMap;
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

    public async setMarked(recipeId: number, isMarked: boolean): Promise<Recipe> {
      const restRecipe: RecipeJsonld = {
        marked: isMarked
      }
      return this.saveInternal(this.client.patchRecipeItem(recipeId.toString(), restRecipe));
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
  ingredients: Ingredient[],
  nameContains: string,
  tags: Tag[],
  isSeasonal: boolean,
  marked: boolean | null,
}