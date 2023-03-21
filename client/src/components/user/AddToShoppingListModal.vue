<template>
  <div>
    <div class="vue-dialog-content">
      <div class="vue-dialog-content-title">Zu Einkaufsliste hinzufügen</div>

      <div class="container">
        <div v-for="shoppingItem in shoppingItems" v-bind="shoppingItem" v-bind:key="getIngredientId(shoppingItem)">
          <shopping-list-item :shoppingItem="shoppingItem" />
        </div>
      </div>
    </div>

    <div class="vue-dialog-buttons">
      <button type="button" tabindex="0" class="vue-dialog-button" @click="doneHandler">Abbrechen</button>
      <button type="button" tabindex="0" class="vue-dialog-button" @click="addToCart">Hinzufügen</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { RecipeIngredient, ShoppingItem, User } from "../../types";
import { getIngredientLabel } from "../../utils/ingredientUtils";
import { ShoppingListClient } from "../../clients/ShoppingItemClient";
import { getShoppingItemsByCategory, getCategoryName } from "../../utils/shoppingItemUtils";
import ShoppingListItem from "../../components/user/ShoppingListItem.vue";

@Component({
  components: {
    ShoppingListItem,
  },
})
export default class AddToShoppingListModal extends Vue {
  @Prop({ required: true }) user!: User;
  @Prop({ required: true }) ingredients!: RecipeIngredient[];
  @Prop({ required: true }) doneHandler!: () => void;

  client = new ShoppingListClient();
  shoppingItems: ShoppingItem[] = [];

  getCategoryName = getCategoryName;

  mounted(): void {
    this.ingredients.forEach(ingredient => {
      this.shoppingItems.push({
        done: false,
        ingredientId: ingredient.ingredient?.ingredientId,
        name: ingredient.ingredient?.name,
        unit: ingredient.unit,
        quantity: ingredient.quantity,
        user: this.user.id
      })
    });
  }

  get itemsByCategory(): Map<number, ShoppingItem[]> {
    return getShoppingItemsByCategory(this.shoppingItems);
  }

  async addToCart(): Promise<void> {
    if (!this.user.id) {
      throw new Error("No logged in user!");
    }
    const shoppingItemsToAdd: ShoppingItem[] = [];
    this.shoppingItems.forEach(shoppingItem => {
      if(!shoppingItem.done) {
        shoppingItemsToAdd.push(shoppingItem);
      }
    });

    this.client.createShoppingItems(this.user.id, shoppingItemsToAdd)
      .finally(() => {
        this.doneHandler();
      });
  }

  getIngredientId(shoppingItem: ShoppingItem): number {
    if (shoppingItem.ingredientId) {
      return shoppingItem.ingredientId;
    }
    return -1;
  }

  getLabel(shoppingItem: ShoppingItem): string {
    return getIngredientLabel(shoppingItem.name, shoppingItem.unit, shoppingItem.quantity);
  }

}
</script>

<style lang="scss" scoped>
.vue-dialog-button {
  flex: 1 1 50%;
}
</style>