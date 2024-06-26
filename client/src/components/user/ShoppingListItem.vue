<template>
  <div class="d-flex justify-content-between shopping-list-item">
    <div class="shopping-list-item-main item-name ps-3" @click="toggle">
      <Icon v-if="isChecked" icon="checkCircle" @click="toggle" />
      <Icon v-else icon="circle" @click="toggle" />
      <span
        class="shopping-list-item-label"
        :class="isChecked ? 'checked-shopping-list-item' : ''"
      >
        {{ getItemLabel() }}
      </span>
    </div>

    <div class="d-flex">
      <div
        v-if="syncFailed"
        class="pe-3"
        title="Synchronization failed"
      >
        <Icon icon="warning" />
      </div>
      <div v-if="removeItemHandler !== null" class="pe-3" @click="removeItem">
        <Icon icon="trash" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-facing-decorator";
import { ShoppingItem } from "../../types";
import { getIngredientLabel } from "../../utils/ingredientUtils";
import { Icon } from "@iconify/vue/dist/offline";

@Component({ components: { Icon } })
export default class ShoppingListItem extends Vue {
  @Prop({ required: true })
  shoppingItem!: ShoppingItem;

  @Prop({ required: false, default: null })
  removeItemHandler?: (shoppingItem: ShoppingItem) => Promise<void>;

  @Prop({ required: false, default: null })
  toggleItemHandler?: (
    shoppingItem: ShoppingItem,
    newState: boolean
  ) => Promise<void>;

  syncFailed = false;

  get isChecked(): boolean {
    if (this.shoppingItem.done) {
      return true;
    }
    return false;
  }

  getItemLabel(): string {
    return getIngredientLabel(
      this.shoppingItem.name,
      this.shoppingItem.unit,
      this.shoppingItem.quantity
    );
  }

  async toggle(): Promise<void> {
    const newDoneState = !this.isChecked;
    this.setDoneState(newDoneState);
  }

  async setDoneState(newDoneState: boolean): Promise<void> {
    if (this.toggleItemHandler) {
      this.shoppingItem.done = newDoneState;
      this.toggleItemHandler(this.shoppingItem, newDoneState)
        .then(() => {
          this.syncFailed = false;
        })
        .catch(() => {
          this.syncFailed = true;
        });
      this.toggleItemHandler(this.shoppingItem, newDoneState);
    } else {
      this.shoppingItem.done = newDoneState;
    }
  }

  removeItem(): void {
    if (this.removeItemHandler) {
      this.removeItemHandler(this.shoppingItem).catch(() => {
        this.syncFailed = true;
        this.setDoneState(true);
      });
    }
  }
}
</script>

<style lang="scss">
@import "../../styles/variables.scss";

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
