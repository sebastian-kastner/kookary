import { ShoppingItem } from '../types';
import { ShoppingItemApi } from '../../rest/api';
import { logAxiosError } from './axiosErrorLogger';
import { clientConfiguration } from './clientConfiguration';
import { ToRestModelConverter } from './ToRestModelConverter';
import { ToViewModelConverter } from './ToViewModelConverter';

export class ShoppingListClient {
  client = new ShoppingItemApi(clientConfiguration);

  viewModelConverter = new ToViewModelConverter();
  restModelConverter = new ToRestModelConverter();

  public async getUserItems(userId: number): Promise<ShoppingItem[]> {
    return new Promise<ShoppingItem[]>((resolve, reject) => {
      this.client.getShoppingItemCollection(userId.toString(), [])
        .then((response) => {
          const items = this.viewModelConverter.convertShoppingItems(response.data['hydra:member']);
          resolve(items);
        })
        .catch((e) => {
          logAxiosError(e);
          reject(e);
        })
    });
  }

  public async createShoppingItem(shoppingItem: ShoppingItem): Promise<number> {
    const userId = shoppingItem.user;
    if(!userId) {
      throw new Error("No user id given");
    }

    const apiItem = this.restModelConverter.convertShoppingItem(shoppingItem);
    return new Promise<number>((resolve, reject) => {
      this.client.postShoppingItemCollection(apiItem)
        .then((response) => {
          const storedItem = this.viewModelConverter.convertShoppingItem(response.data);
          if(storedItem.shoppingItemId) {
            resolve(storedItem.shoppingItemId);
          } else {
            reject("No shopping item id returned!");
          }
        })
        .catch((e) => {
          logAxiosError(e);
          reject(e)
        });
    });
  }

  public async updateShoppingItem(shoppingItemId: number, shoppingItem: ShoppingItem): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.client.patchShoppingItemItem(shoppingItemId.toString(), this.restModelConverter.convertShoppingItem(shoppingItem))
        .then(() => {
          resolve();
        })
        .catch((err) => {
          logAxiosError(err);
          reject(err);
        });
    });
  }

  public async setDoneState(shoppingItemId: number, newState: boolean): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.client.patchShoppingItemItem(shoppingItemId.toString(), {
        done: newState
      })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        logAxiosError(err);
        reject(err);
      })
    });
  }

  public async deleteShoppingItem(shoppingItemId: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.client.deleteShoppingItemItem(shoppingItemId.toString())
        .then(() => resolve())
        .catch((e) => {
          logAxiosError(e);
          reject(e)
        });
    });
  }
}