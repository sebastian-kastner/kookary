import { Ingredient, Recipe, Tag } from '../types'
import { AxiosError, AxiosResponse } from 'axios'
import { RecipeApi } from '../../rest/api'
import { clientConfiguration } from './clientConfiguration'
import { ToViewModelConverter } from './ToViewModelConverter'
import { ToRestModelConverter } from './ToRestModelConverter'
import { logAxiosError } from './axiosErrorLogger';
import { RecipeJsonld } from 'rest/models'
import { tagStore } from '../stores/rootStore'
import { mediaObjectStore } from "../stores/rootStore"

export type RecipeFilter = {
  page?: number,
  ingredients?: Ingredient[],
  nameContains?: string,
  tags?: Tag[],
  isSeasonal?: boolean,
  marked?: boolean,
  limit?: number,
  orderByRand?: boolean,
}

export type RecipesList = {
  recipes: Recipe[],
  totalItems?: number,
  hasMoreItems: boolean,
}

const recipesPerPage = 24;
export class RecipesClient {
    client = new RecipeApi(clientConfiguration);

    toViewModelConverter = new ToViewModelConverter();
    toRestModelConverter = new ToRestModelConverter();

    /**
     * 
     * @returns all recipes
     */
    public async getRecipes (filter?: RecipeFilter): Promise<RecipesList> {
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
      if(filter?.marked) {
        isMarked = filter.marked;
      }

      let limit = undefined;
      if(filter?.limit) {
        limit = filter.limit;
      }

      const orderByRand = filter?.orderByRand;

      const getPromise = this.client.getRecipeCollection(
        page,
        ingredientFilter,
        tagFilter,
        isSeasonal,
        isMarked,
        limit,
        orderByRand,
        filter?.nameContains
      );

      return new Promise<RecipesList>((resolve, reject) => {
        getPromise
          .then((ret) => {
            const apiRecipes = ret.data['hydra:member'];
            const totalItems = ret.data['hydra:totalItems'];
            let hasMoreItems = false;
            if(totalItems && filter?.page && filter.page * recipesPerPage < totalItems) {
              hasMoreItems = true;
            }

            const recipes: Recipe[] = []
            apiRecipes.forEach((apiRecipe) => {
              recipes.push(this.toViewModelConverter.convertRecipe(apiRecipe))
            });


            resolve({
              recipes: recipes,
              totalItems: totalItems,
              hasMoreItems: hasMoreItems,
            });
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
          const resolvedTag = tags.get(tag.tagId);
          if(resolvedTag) {
            tag.name = resolvedTag.name;
          }
        }
      });
      // manually resolve uploaded images
      return recipe;
    }

    /**
     * Saves the recipe if it does not have a recipeId yet or updates the given recipe if it does have a recipeId.
     * 
     * @param recipe the recipe to be saved/updated
     * @returns the saved recipe
     */
    public async saveRecipe(recipe: Recipe): Promise<Recipe> {
      // if a new file is set, upload the new file
      if(recipe.images.length > 0 && recipe.images[0].file) {
        const uploadedFile = await mediaObjectStore.createMediaObject({
          file: recipe.images[0].file,
          fileName: recipe.name
        });
        recipe.images[0] = uploadedFile;
      }

      const restRecipe = this.toRestModelConverter.convertRecipe(recipe);

      if(recipe.recipeId) {
        const saveInternal = await this.saveInternal(this.client.patchRecipeItem(recipe.recipeId.toString(), restRecipe));
        // FIXME this is fugly
        // no need to wait for the deletions.. keep fingers crossed, hope for the best
        recipe.imagesToDelete.forEach((mediaObjectId) => {
          mediaObjectStore.deleteMediaObject(mediaObjectId);
        });
        return saveInternal;
      }
      return this.saveInternal(this.client.postRecipeCollection(restRecipe));
    }

    public async deleteRecipe(recipeId: number): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        this.client.deleteRecipeItem(recipeId.toString())
          .then(() => resolve())
          .catch((e) => {
            logAxiosError(e);
            reject(e);
          });
      })
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

