<template>
  <div
    id="ingredient-editor"
    class="form-group"
  >
    <div class="row g-3">
      <div class="col-sm-6">
        <input
          v-if="itemSelected"
          class="form-control simple-typeahead-input"
          type="text"
          v-model="shoppingItem.name"
          disabled="true"
        />
        <typeahead-input
          v-else
          :items="existingIngredients"
          :value="getItemLabel(shoppingItem)"
          :itemProjection="getItemLabel"
          :addNewHandler="setItemName"
          @selectItem="setIngredient"
        />
      </div>
      <div class="col-sm">
        <input
          type="text"
          class="form-control"
          placeholder="Menge"
          v-model="shoppingItem.quantity"
          v-on:focusout="valuesChanged"
        />
      </div>
      <div class="col-sm">
        <input
          type="text"
          class="form-control"
          placeholder="Einheit"
          v-model="shoppingItem.unit"
          v-on:focusout="valuesChanged"
        />
      </div>
      <div class="col-sm">
        <button
          type="button"
          class="btn rounded-button"
          v-if="itemSelected"
          v-on:click="removeIngredient"
        >
          X
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { ShoppingItem, Ingredient } from "../../types";
import TypeaheadInput from "../TypeaheadInput.vue";

@Component({
  components: { TypeaheadInput },
})
export default class ShoppingListItem extends Vue {
  @Prop({ required: true }) shoppingItem!: ShoppingItem;
  @Prop({ required: true }) existingIngredients!: Ingredient[];

  get itemSelected(): boolean {
    if (this.shoppingItem && this.shoppingItem.shoppingItemId) {
      return true;
    }
    return false;
  }

  setIngredient(ingredient: Ingredient): void {
    this.shoppingItem.ingredientId = ingredient.ingredientId;
    this.shoppingItem.name = ingredient.name;
    this.emitItemSelected();
  }

  getItemLabel(item: ShoppingItem | null | undefined): string {
    if (item && item.name) {
      return item.name;
    }
    return "";
  }

  removeIngredient(): void {
    this.$emit("onItemDelete", this.shoppingItem);
  }

  async setItemName(itemName: string): Promise<void> {
    this.shoppingItem.ingredientId = null;
    this.shoppingItem.name = itemName;
    this.emitItemSelected();
  }

  async valuesChanged(): Promise<void> {
    if (this.itemSelected) {
      this.$emit("valuesChanged", this.shoppingItem);
    }
  }

  private emitItemSelected(): void {
    this.$emit("onItemSelected", this.shoppingItem);
  }
}
</script>

<style lang="scss">
@import "../../../main.scss";

#ingredient-editor {
  .rounded-button {
    font-size: 13px;
    padding: 3px 8px 3px 9px;
    border-radius: 40px;
  }

  input:disabled {
    background-color: $background-color-highlight-1;
  }
}
</style>