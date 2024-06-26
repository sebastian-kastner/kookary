<template>
  <div class="main-content p-2">
    <h2>Einkaufsliste</h2>

    <div>
      <div class="d-flex justify-content-center">
        <div class="col-4 pe-2">
          <input
            v-model="amountAndUnit"
            class="form-control"
            type="text"
            placeholder="Menge"
          />
        </div>
        <div class="col-8">
          <typeahead-input
            :items="ingredients"
            :value="itemName"
            :item-projection="getIngredientName"
            reset-on-select="true"
            placeholder="Name"
            :add-new-handler="addNewCustomItem"
            @selectItem="addNewIngredientItem"
          />
        </div>
      </div>
    </div>

    <div class="pt-2">
      <div v-for="entry in itemsByCategory" :key="entry[0]" class="pt-2">
        {{ getCategoryName(entry[0]) }}
        <div
          v-for="shoppingItem in entry[1]"
          v-bind="shoppingItem"
          :key="getShoppingItemId(shoppingItem)"
        >
          <shopping-list-item
            :shopping-item="shoppingItem"
            :remove-item-handler="deleteItem"
            :toggle-item-handler="toggleItem"
          />
        </div>
      </div>

      <div class="d-flex justify-content-end pt-3">
        <save-button
          button-text="Speichern"
          :is-loading="isSaving"
          @onSave="applyChanges"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Ingredient, ShoppingItem, User } from "../../types";
import { Component, mixins } from "vue-facing-decorator";
import { ingredientStore, userStore } from "../../stores/rootStore";
import { ShoppingListClient } from "../../clients/ShoppingItemClient";
import ShoppingListItem from "../../components/user/ShoppingListItem.vue";
import TypeaheadInput from "../../components/TypeaheadInput.vue";
import ToastMixin from "../../mixins/ToastMixin.vue";
import {
  getShoppingItemsByCategory,
  getCategoryName,
} from "../../utils/shoppingItemUtils";
import SaveButton from "../../components/SaveButton.vue";
import { getErrorMessage } from "../../utils/errors";

type AmountAndUnit = {
  amount?: string;
  unit?: string;
};

@Component({
  components: {
    ShoppingListItem,
    TypeaheadInput,
    SaveButton,
  },
})
export default class ShoppingList extends mixins(ToastMixin) {
  shoppingListClient = new ShoppingListClient();

  shoppingItems: ShoppingItem[] = [];

  getCategoryName = getCategoryName;

  // fields for new item editor
  amountAndUnit = "";
  itemName = "";

  isSaving = false;

  mounted(): void {
    this.readShoppingItems();
  }

  private readShoppingItems(): void {
    if (!this.user || !this.user.id) {
      throw new Error("No user logged in!");
    }
    this.shoppingListClient.getUserItems(this.user.id).then((items) => {
      this.shoppingItems = items;
    });
  }

  get itemsByCategory(): Map<number, ShoppingItem[]> {
    return getShoppingItemsByCategory(this.shoppingItems);
  }

  get user(): User | null {
    return userStore.user;
  }

  get ingredients(): Ingredient[] {
    return ingredientStore.ingredients;
  }

  async deleteItem(shoppingItemToRemove: ShoppingItem): Promise<void> {
    if (!shoppingItemToRemove.shoppingItemId) {
      console.warn("no shoppingItemId available, skipping delete");
      return;
    }
    const id = shoppingItemToRemove.shoppingItemId;
    return new Promise<void>((resolve, reject) => {
      this.shoppingListClient
        .deleteShoppingItem(id)
        .then(() => {
          this.shoppingItems.splice(
            this.shoppingItems.indexOf(shoppingItemToRemove),
            1
          );
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async toggleItem(
    shoppingItem: ShoppingItem,
    newState: boolean
  ): Promise<void> {
    if (!shoppingItem.shoppingItemId) {
      throw new Error("No ShoppingItem Id set, cannot set done state!");
    }
    
    const itemId = shoppingItem.shoppingItemId;
    return new Promise<void>((resolve, reject) => {
      this.shoppingListClient
        .setDoneState(itemId, newState)
        .then(() => {
          shoppingItem.done = newState;
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  addNewIngredientItem(ingredient: Ingredient): void {
    if (ingredient.name) {
      this.storeItem(ingredient.name, ingredient.ingredientId);
    }
  }

  addNewCustomItem(itemName: string): void {
    this.storeItem(itemName);
  }

  async storeItem(
    itemName: string,
    ingredientId?: number | null
  ): Promise<void> {
    const amountAndUnit = this.getAmountAndUnit();
    const shoppingItem: ShoppingItem = {
      name: itemName,
      quantity: amountAndUnit.amount,
      unit: amountAndUnit.unit,
      ingredientId: ingredientId,
      user: this.user?.id,
      done: false,
    };

    return new Promise<void>((resolve, reject) => {
      this.shoppingListClient
        .createShoppingItem(shoppingItem)
        .then((shoppingItemId) => {
          shoppingItem.shoppingItemId = shoppingItemId;
          this.shoppingItems.push(shoppingItem);

          this.itemName = "";
          this.amountAndUnit = "";

          resolve();
        })
        .catch((err) => reject(err));
    });
  }

  async applyChanges(): Promise<void> {
    // get ids of items in done state
    const idsToDelete: number[] = [];
    const remainingItems: ShoppingItem[] = [];
    this.shoppingItems.forEach((item) => {
      if (item.done && item.shoppingItemId) {
        idsToDelete.push(item.shoppingItemId);
      } else {
        remainingItems.push(item);
      }
    });

    // delete items in done state
    this.isSaving = true;
    this.shoppingListClient
      .deleteShoppingItems(idsToDelete)
      .then(() => {
        this.isSaving = false;
        this.shoppingItems = remainingItems;
      })
      .catch((err) => {
        this.isSaving = false;
        // re-synchronize items with database in case of error
        const errorMessage = getErrorMessage(err);
        this.showToast.error(`Fehler beim Löschen der Items: ${errorMessage}`);
        this.readShoppingItems();
      });
  }

  getAmountAndUnit(): AmountAndUnit {
    let amount = "";
    let unit = "";
    const re = /\d+/g;
    const result = re.exec(this.amountAndUnit);
    if (result && result[0]) {
      amount = result[0];
      if (amount !== this.amountAndUnit) {
        unit = this.amountAndUnit.substring(amount.length).trim();
      }
    } else {
      unit = this.amountAndUnit;
    }
    return {
      amount: amount,
      unit: unit,
    };
  }

  getIngredientName(item: Ingredient): string {
    if (item && item.name) {
      return item.name;
    }
    return "";
  }

  getShoppingItemId(shoppingItem: ShoppingItem): number | undefined {
    if (shoppingItem.shoppingItemId) {
      return shoppingItem.shoppingItemId;
    }
    return undefined;
  }
}
</script>

<style lang="scss" scoped>
.apply-button {
  margin-top: 15px;
}
</style>
