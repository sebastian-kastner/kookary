import { UserRecipeFavouritesApi } from '../../rest/api'
import { logAxiosError } from './axiosErrorLogger'
import { clientConfiguration } from './clientConfiguration'
import * as ep from './endpoints'
import { toIri } from './ToRestModelConverter'
import { toId } from './ToViewModelConverter'

export class UserRecipeFavouritesClient {
  client = new UserRecipeFavouritesApi(clientConfiguration);

  public async getUserFavourite(userId: number, recipeId: number): Promise<number | null> {
    return new Promise<number | null>((resolve, reject) => {
      this.client.getUserRecipeFavouritesCollection(
        userId.toString(), [], recipeId.toString(), []
      )
        .then((response) => {
          const favourites = response.data['hydra:member'];
          if (favourites.length > 0) {
            const id = toId(favourites[0]['@id']);
            if (id) {
              resolve(id);
              return;
            }
          }
          resolve(null);
        })
        .catch((e) => {
          logAxiosError(e);
          reject(e);
        })
    });
  }

  public async createUserFavourite(userId: number, recipeId: number): Promise<null | number> {
    return new Promise<null | number>((resolve, reject) => {
      this.client.postUserRecipeFavouritesCollection({
        user: toIri(ep.USER_ENDPOINT, userId),
        recipe: toIri(ep.RECIPES_ENDPOINT, recipeId),
      })
        .then((response) => {
          const favouriteId = response.data.userRecipeFavouriteId;
          if (favouriteId) {
            resolve(favouriteId);
          } else {
            resolve(null);
          }
        })
        .catch((e) => {
          logAxiosError(e);
          reject(e)
        });
    });
  }

  public async deleteUserFavourite(userRecipeFavouriteId: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.client.deleteUserRecipeFavouritesItem(userRecipeFavouriteId.toString())
        .then(() => resolve())
        .catch((e) => {
          logAxiosError(e);
          reject(e)
        });
    });
  }
}