<template>
  <VueFinalModal
    class="vfm-modal"
    content-class="vfm-modal-content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
  >
    <div class="d-flex justify-content-between">
      <h4>Zu Einkaufsliste hinzufügen</h4>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        @click="$emit('cancel')"
      ></button>
    </div>

    <div class="container pt-2">
      <div
        v-for="shoppingItem in shoppingItems"
        v-bind="shoppingItem"
        :key="getIngredientId(shoppingItem)"
      >
        <shopping-list-item :shopping-item="shoppingItem" />
      </div>
    </div>

    <div class="d-flex justify-content-between pt-2">
      <button
        type="button"
        tabindex="0"
        class="btn btn-outline-primary"
        @click="$emit('cancel')"
      >
        Abbrechen
      </button>
      <button
        type="button"
        tabindex="0"
        class="btn btn-outline-primary"
        @click="addToCart"
      >
        Hinzufügen
      </button>
    </div>
  </VueFinalModal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-facing-decorator";
import { RecipeIngredient, ShoppingItem, User } from "../../types";
import { getIngredientLabel } from "../../utils/ingredientUtils";
import { ShoppingListClient } from "../../clients/ShoppingItemClient";
import {
  getShoppingItemsByCategory,
  getCategoryName,
} from "../../utils/shoppingItemUtils";
import ShoppingListItem from "../../components/user/ShoppingListItem.vue";
import { VueFinalModal } from "vue-final-modal";

@Component({
  components: {
    ShoppingListItem,
    VueFinalModal,
  },
})
export default class AddToShoppingListModal extends Vue {
  @Prop({ required: true }) user!: User;
  @Prop({ required: true }) ingredients!: RecipeIngredient[];

  client = new ShoppingListClient();
  shoppingItems: ShoppingItem[] = [];

  getCategoryName = getCategoryName;

  mounted(): void {
    this.ingredients.forEach((ingredient) => {
      if (ingredient.ingredient) {
        this.shoppingItems.push({
          done: false,
          ingredientId: ingredient.ingredient.ingredientId,
          name: ingredient.ingredient.name,
          unit: ingredient.unit,
          quantity: ingredient.quantity,
          user: this.user.id,
        });
      }
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
    this.shoppingItems.forEach((shoppingItem) => {
      if (!shoppingItem.done) {
        shoppingItemsToAdd.push(shoppingItem);
      }
    });

    this.client
      .createShoppingItems(this.user.id, shoppingItemsToAdd)
      .finally(() => {
        this.$emit("done");
      });
  }

  getIngredientId(shoppingItem: ShoppingItem): number {
    if (shoppingItem.ingredientId) {
      return shoppingItem.ingredientId;
    }
    return -1;
  }

  getLabel(shoppingItem: ShoppingItem): string {
    return getIngredientLabel(
      shoppingItem.name,
      shoppingItem.unit,
      shoppingItem.quantity
    );
  }
}
</script>
