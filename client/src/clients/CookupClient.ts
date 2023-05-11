import { Cookup } from "../types";
import { CookupApi } from "../../rest/api";
import { logAxiosError } from "./axiosErrorLogger";
import { clientConfiguration } from "./clientConfiguration";
import * as ep from "./endpoints";
import { toIri } from "./ToRestModelConverter";
import { ToViewModelConverter } from "./ToViewModelConverter";

export class CookupClient {
  client = new CookupApi(clientConfiguration);
  viewModelConverter = new ToViewModelConverter();

  public async getCookups(userId: number, recipeId: number): Promise<Cookup[]> {
    return new Promise<Cookup[]>((resolve, reject) => {
      this.client
        .getCookupCollection(userId.toString(), [], recipeId.toString(), [])
        .then((response) => {
          const cookups = this.viewModelConverter.convertCookups(
            response.data["hydra:member"]
          );
          resolve(cookups);
        })
        .catch((e) => {
          logAxiosError(e);
          reject(e);
        });
    });
  }

  public async createCookup(
    userId: number,
    recipeId: number,
    date: Date
  ): Promise<Cookup> {
    const datetimeDate = date.toISOString().slice(0, 19).replace("T", " ");

    return new Promise<Cookup>((resolve, reject) => {
      this.client
        .postCookupCollection({
          user: toIri(ep.USER_ENDPOINT, userId),
          recipe: toIri(ep.RECIPES_ENDPOINT, recipeId),
          date: datetimeDate,
        })
        .then((response) => {
          const cookup = this.viewModelConverter.convertCookup(response.data);
          resolve(cookup);
        })
        .catch((e) => {
          logAxiosError(e);
          reject(e);
        });
    });
  }

  public async deleteCookup(cookupId: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.client
        .deleteCookupItem(cookupId.toString())
        .then(() => resolve())
        .catch((e) => {
          logAxiosError(e);
          reject(e);
        });
    });
  }
}
