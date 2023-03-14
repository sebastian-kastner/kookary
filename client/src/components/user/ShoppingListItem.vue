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
    let label = "";
    if (this.shoppingItem && this.shoppingItem.name) {
      label = this.shoppingItem.name + " ";
      if (this.shoppingItem.quantity || this.shoppingItem.unit) {
        let space = "";
        if (this.shoppingItem.quantity && this.shoppingItem.unit) {
          space = " ";
        }
        label += `(${this.shoppingItem.quantity}${space}${this.shoppingItem.unit})`;
      }
    }
    return label;
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
@import "../../../main.scss";

.shopping-list-item {
  color: $link-color-main;
  border: 1px solid $button-color-main;
  border-radius: 15px;
  margin-bottom: 4px;
  padding: 4px 0 5px 0;

  .item-name {
    min-width: 70%;
  }

  svg {
    font-size: 1.6rem;
    padding-top: 2px;
    padding-bottom: 2px;
  }
}

</style>