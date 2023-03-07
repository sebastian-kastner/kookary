<template>
  <div id="home" class="main-content">
    <h2>Einkaufsliste</h2>

    <div class="form-group">
      <div class="form-row justify-content-center">
        <div class="col-4">
          <input class="form-control" type="text" v-model="amountAndUnit" placeholder="Menge" />
        </div>
        <div class="col-8">
          <typeahead-input :items="ingredients" :value="itemName" :itemProjection="getIngredientName"
            resetOnSelect="true" placeholder="Name" :addNewHandler="addNewCustomItem"
            @selectItem="addNewIngredientItem" />
        </div>
      </div>
    </div>

    <div class="container">
      <div v-for="shoppingItem in shoppingItems" v-bind="shoppingItem" v-bind:key="getShoppingItemId(shoppingItem)">
        <shopping-list-item :shoppingItem="shoppingItem" @onItemDelete="deleteItem" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Ingredient, ShoppingItem, User } from "../../types";
import { Component, Vue } from "vue-property-decorator";
import { ingredientStore, userStore } from "../../stores/rootStore";
import { ShoppingListClient } from "../../clients/ShoppingItemClient";
import ShoppingListItem from "../../components/user/ShoppingListItem.vue";
import TypeaheadInput from "../../components/TypeaheadInput.vue"

type AmountAndUnit = {
  amount?: string,
  unit?: string
}

@Component({
  components: {
    ShoppingListItem,
    TypeaheadInput
  },
})
export default class ShoppingList extends Vue {
  shoppingListClient = new ShoppingListClient();

  shoppingItems: ShoppingItem[] = [];

  // fields for new item editor
  amountAndUnit = "";
  itemName = "";

  mounted(): void {
    if (!this.user || !this.user.id) {
      throw new Error("No user logged in!");
    }

    this.shoppingListClient.getUserItems(this.user.id).then(items => {
      this.shoppingItems = items;
    });
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
      this.shoppingListClient.deleteShoppingItem(id)
        .then(() => {
          this.shoppingItems.splice(this.shoppingItems.indexOf(shoppingItemToRemove), 1);
          resolve();
        })
        .catch((err) => { reject(err); })
    });
  }

  addNewIngredientItem(ingredient: Ingredient): void {
    if(ingredient.name) {
      this.storeItem(ingredient.name, ingredient.ingredientId);
    }
  }

  addNewCustomItem(itemName: string): void {
    this.storeItem(itemName);
  }

  async storeItem(itemName: string, ingredientId?: number | null): Promise<void> {
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
      this.shoppingListClient.createShoppingItem(shoppingItem)
        .then((shoppingItemId => {
          shoppingItem.shoppingItemId = shoppingItemId;
          this.shoppingItems.push(shoppingItem);
          
          this.itemName = "";
          this.amountAndUnit = "";

          resolve();
        }))
        .catch(err => reject(err));
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
    }
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

<style lang="scss">
@import "../../../main.scss";

#home {
  padding: $content-padding;
}
</style>
