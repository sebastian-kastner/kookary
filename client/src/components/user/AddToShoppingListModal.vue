<template>
  <div>
    <div class="vue-dialog-content">
      <div class="vue-dialog-content-title">Zu Einkaufsliste hinzufügen</div>

      <div class="container">
        <div class="row shopping-list-item" v-for="ingredient in ingredients" v-bind="ingredient"
          v-bind:key="getIngredientId(ingredient)">
          <div class="col">
            {{ getLabel(ingredient) }}
          </div>
          <div class="col-auto" @click="removeIngredient(ingredient)">
            <b-icon-trash />
          </div>
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
import { ShoppingListClient } from "../../clients/ShoppingItemClient"

@Component({})
export default class AddToShoppingListModal extends Vue {
  @Prop({ required: true }) user!: User;
  @Prop({ required: true }) ingredients!: RecipeIngredient[];
  @Prop({ required: true }) doneHandler!: () => void;

  client = new ShoppingListClient();

  removeIngredient(ingredient: RecipeIngredient): void {
    this.ingredients.splice(this.ingredients.indexOf(ingredient), 1);
  }

  async addToCart(): Promise<void> {
    if (!this.user.id) {
      throw new Error("No logged in user!");
    }
    const shoppingItems: ShoppingItem[] = [];
    this.ingredients.forEach((ingredient) => {
      shoppingItems.push({
        done: false,
        ingredientId: ingredient.ingredient?.ingredientId,
        name: ingredient.ingredient?.name,
        unit: ingredient.unit,
        quantity: ingredient.quantity,
        user: this.user.id
      })
    });

    this.client.createShoppingItems(this.user.id, shoppingItems)
      .finally(() => {
        this.doneHandler();
      });
  }

  getIngredientId(ingredient: RecipeIngredient): number {
    if (ingredient.ingredient?.ingredientId) {
      return ingredient.ingredient.ingredientId;
    }
    return -1;
  }

  getLabel(ingredient: RecipeIngredient): string {
    return getIngredientLabel(ingredient.ingredient?.name, ingredient.unit, ingredient.quantity);
  }

}
</script>

<style lang="scss" scoped>
@import "../../../scss/shopping-list.scss";

.vue-dialog-button {
  flex: 1 1 50%;
}
</style>