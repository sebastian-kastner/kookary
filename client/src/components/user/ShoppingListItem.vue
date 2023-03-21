<template>
  <div class="row shopping-list-item">
    <div class="col-auto mr-auto shopping-list-item-main item-name" @click="toggle">
      <b-icon-check-circle v-if="isChecked" @click="toggle"/>
      <b-icon-circle v-else @click="toggle"/>
      <span class="shopping-list-item-label" :class="isChecked ? 'checked-shopping-list-item' : ''">{{getItemLabel()}}</span>
    </div>

    <div v-if="removeItemHandler !== null" class="col-auto" @click="removeItem">
      <b-icon-trash />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { ShoppingItem } from "../../types";
import { getIngredientLabel } from "../../utils/ingredientUtils";

@Component({
})
export default class ShoppingListItem extends Vue {
  @Prop({ required: true })
  shoppingItem!: ShoppingItem;

  @Prop({ required: false, default: null })
  removeItemHandler?: (shoppingItem: ShoppingItem) => Promise<void>;

  @Prop({ required: false, default: null })
  toggleItemHandler?: (shoppingItem: ShoppingItem, newState: boolean) => Promise<void>;

  get isChecked(): boolean {
    if(this.shoppingItem.done) {
      return true;
    }
    return false;
  }

  getItemLabel(): string {
    return getIngredientLabel(this.shoppingItem.name, this.shoppingItem.unit, this.shoppingItem.quantity);
  }

  async toggle(): Promise<void> {
    const newDoneState = !this.isChecked;
    if (this.toggleItemHandler) {
      this.toggleItemHandler(this.shoppingItem, newDoneState);
    } else {
      this.shoppingItem.done = newDoneState;
    }
  }

  removeItem(): void {
    if(this.removeItemHandler) {
      this.removeItemHandler(this.shoppingItem);
    }
  }
}
</script>

<style lang="scss">
@import "../../../main.scss";

.shopping-list-item {
  color: $link-color-main;
  border: 1px solid $button-color-main;
  border-radius: 15px;
  margin-bottom: 4px;
  padding: 4px 0 5px 0;

  .shopping-list-item-main {
    min-width: 70%;
  }

  .shopping-list-item-label {
    padding-left: 6px;
  }

  .checked-shopping-list-item {
    text-decoration: line-through;
  }

  svg {
    font-size: 1.6rem;
    padding-top: 2px;
    padding-bottom: 2px;
  }
}
</style>