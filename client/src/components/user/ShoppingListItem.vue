<template>
  <div class="row shopping-list-item">
    <div class="col-auto mr-auto shopping-list-item-main item-name" @click="toggle">
      <b-icon-check-circle v-if="isChecked" @click="toggle"/>
      <b-icon-circle v-else @click="toggle"/>

      {{getItemLabel()}}
      
    </div>
    <div class="col-auto" @click="removeItem">
      <b-icon-trash />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { ShoppingItem } from "../../types";
import { ShoppingListClient } from "../../clients/ShoppingItemClient";
import { getIngredientLabel } from "../../utils/ingredientUtils"

@Component({
})
export default class ShoppingListItem extends Vue {
  @Prop({ required: true }) shoppingItem!: ShoppingItem;

  client = new ShoppingListClient();

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
    if (!this.shoppingItem.shoppingItemId) {
      throw new Error("No ShoppingItem Id set, cannot set done state!");
    }
    const newDoneState = !this.isChecked;
    this.client.setDoneState(this.shoppingItem.shoppingItemId, newDoneState).then(() => {
      this.shoppingItem.done = newDoneState;
    });
  }

  removeItem(): void {
    this.$emit("onItemDelete", this.shoppingItem);
  }
}
</script>

<style lang="scss">
@import "../../../scss/shopping-list.scss";
</style>