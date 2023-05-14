import { ShoppingItem } from "../types";
import { ShoppingItemApi } from "../../rest/api";
import { logAxiosError } from "./axiosErrorLogger";
import { clientConfiguration } from "./clientConfiguration";
import { convertShoppingItem } from "./ToRestModelConverter";
import {
  convertShoppingItems,
  convertShoppingItem as convertToViewModelShoppingItem,
} from "./ToViewModelConverter";

export class ShoppingListClient {
  client = new ShoppingItemApi(clientConfiguration);

  public async getUserItems(userId: number): Promise<ShoppingItem[]> {
    return new Promise<ShoppingItem[]>((resolve, reject) => {
      this.client
        .getShoppingItemCollection(userId.toString(), [])
        .then((response) => {
          const items = convertShoppingItems(response.data["hydra:member"]);
          resolve(items);
        })
        .catch((e) => {
          logAxiosError(e);
          reject(e);
        });
    });
  }

  public async createShoppingItem(shoppingItem: ShoppingItem): Promise<number> {
    const userId = shoppingItem.user;
    if (!userId) {
      throw new Error("No user id given");
    }

    const apiItem = convertShoppingItem(shoppingItem);
    return new Promise<number>((resolve, reject) => {
      this.client
        .postShoppingItemCollection(apiItem)
        .then((response) => {
          const storedItem = convertToViewModelShoppingItem(response.data);
          if (storedItem.shoppingItemId) {
            resolve(storedItem.shoppingItemId);
          } else {
            reject("No shopping item id returned!");
          }
        })
        .catch((e) => {
          logAxiosError(e);
          reject(e);
        });
    });
  }

  public async createShoppingItems(
    userId: number,
    shoppingItems: ShoppingItem[]
  ): Promise<void> {
    const promises: Promise<number>[] = [];
    shoppingItems.forEach((item) => {
      promises.push(this.createShoppingItem(item));
    });

    return new Promise<void>((resolve, reject) => {
      Promise.all(promises)
        .then(() => resolve())
        .catch(() => reject());
    });
  }

  public async updateShoppingItem(
    shoppingItemId: number,
    shoppingItem: ShoppingItem
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.client
        .patchShoppingItemItem(
          shoppingItemId.toString(),
          convertShoppingItem(shoppingItem)
        )
        .then(() => {
          resolve();
        })
        .catch((err) => {
          logAxiosError(err);
          reject(err);
        });
    });
  }

  public async setDoneState(
    shoppingItemId: number,
    newState: boolean
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.client
        .patchShoppingItemItem(shoppingItemId.toString(), {
          done: newState,
        })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          logAxiosError(err);
          reject(err);
        });
    });
  }

  public async deleteShoppingItem(shoppingItemId: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.client
        .deleteShoppingItemItem(shoppingItemId.toString())
        .then(() => resolve())
        .catch((e) => {
          logAxiosError(e);
          reject(e);
        });
    });
  }

  public async deleteShoppingItems(shoppingItemIds: number[]): Promise<void> {
    const promises: Promise<void>[] = [];
    shoppingItemIds.forEach((id) => {
      promises.push(this.deleteShoppingItem(id));
    });
    return new Promise<void>((resolve, reject) => {
      Promise.all(promises)
        .then(() => resolve())
        .catch(() => reject());
    });
  }
}
