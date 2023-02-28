<template>
  <div id="home" class="main-content">
    <h2>Einkaufsliste</h2>
    <div v-for="shoppingItem in shoppingItems" v-bind="shoppingItem" v-bind:key="getShoppingItemId(shoppingItem)">
      <shopping-list-item :shoppingItem="shoppingItem" :existingIngredients="ingredients" @onItemSelected="addItem"
        @onItemDelete="deleteItem" @valuesChanged="valuesChanged"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Ingredient, ShoppingItem, User } from "../../types";
import { Component, Vue } from "vue-property-decorator";
import { ingredientStore, userStore } from "../../stores/rootStore";
import { ShoppingListClient } from "../../clients/ShoppingItemClient";
import ShoppingListItem from "../../components/user/ShoppingListItem.vue";

@Component({
  components: {
    ShoppingListItem,
  },
})
export default class ShoppingList extends Vue {
  shoppingListClient = new ShoppingListClient();

  itemToAdd: string | null = null;

  inputPlaceholder = "";

  shoppingItems: ShoppingItem[] = [];

  mounted(): void {
    if (!this.user || !this.user.id) {
      throw new Error("No user logged in!");
    }

    this.shoppingListClient.getUserItems(this.user.id).then(items => {
      this.shoppingItems = items;
      this.pushEmptyItem();
    });
  }

  get user(): User | null {
    return userStore.user;
  }
  get ingredients(): Ingredient[] {
    return ingredientStore.ingredients;
  }

  async addItem(shoppingItem: ShoppingItem): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.shoppingListClient.createShoppingItem(shoppingItem)
        .then((shoppingItemId => {
          shoppingItem.shoppingItemId = shoppingItemId
          this.pushEmptyItem();
          resolve();
        }))
        .catch(err => reject(err));
    });
  }

  async deleteItem(shoppingItemToRemove: ShoppingItem): Promise<void> {
    if (!shoppingItemToRemove.shoppingItemId) {
      console.warn("no shoppingItemId available, skipping delete");
      return;
    }

    const id = shoppingItemToRemove.shoppingItemId;
    return new Promise<void>((resolve, reject) => {
      this.shoppingListClient.deleteShoppingItem(id)
        .then(() => {
          this.shoppingItems.splice(this.shoppingItems.indexOf(shoppingItemToRemove), 1);
          resolve();
        })
        .catch((err) => { reject(err); })
    });
  }

  async valuesChanged(changedItem: ShoppingItem): Promise<void> {
    if (!changedItem.shoppingItemId) {
      console.warn("no shoppingItemId available, skipping value update");
      return;
    }
    const id = changedItem.shoppingItemId;

    return new Promise<void>((resolve, reject) => {
      this.shoppingListClient.updateShoppingItem(id, changedItem)
      .then(() => resolve())
      .catch((err) => reject(err));
    });
  }

  getShoppingItemId(shoppingItem: ShoppingItem): number | undefined {
    if (shoppingItem.shoppingItemId) {
      return shoppingItem.shoppingItemId;
    }
    return undefined;
  }

  private pushEmptyItem(): void {
    this.shoppingItems.push({
      name: "",
      done: false,
      user: this.user?.id,
      ingredientId: null,
      quantity: null,
      shoppingItemId: null,
    });
  }
}
</script>

<style lang="scss">
@import "../../../main.scss";

#home {
  padding: $content-padding;
}
</style>
