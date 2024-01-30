<template>
  <hr v-if="separatorIndex > 0" />
  <div class="mb-3 mt-3 separator-editor">
    <div class="d-flex flex-row">
      <div
        class="col-1 d-flex align-items-center justify-content-center"
        :class="handleClass"
      >
        <Icon icon="arrowDownUp" />
      </div>
      <div class="col-10">
        <input
          v-model="separator.separatorLabel"
          placeholder="Überschrift, z.B. Für die Sauce"
          class="form-control simple-typeahead-input"
          type="text"
        />
      </div>
      <div
        class="col-1 d-flex align-items-center justify-content-center delete-separator-col"
        @click="removeSeparator"
      >
        <Icon icon="trash" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, mixins } from "vue-facing-decorator";
import { RecipeIngredient } from "../../types";
import ToastMixin from "../../mixins/ToastMixin.vue";
import TypeaheadInput from "..//TypeaheadInput.vue";
import { Icon } from "@iconify/vue/dist/offline";

@Component({
  components: { TypeaheadInput, Icon },
})
export default class RecipeIngredientEditor extends mixins(ToastMixin) {
  @Prop({ required: true }) separator!: RecipeIngredient;
  @Prop({ required: true }) separatorIndex!: number;
  @Prop({ required: true }) handleClass!: string;

  removeSeparator(): void {
    this.$emit("onDelete", this.separator);
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";

.separator-editor {
  .rounded-button {
    font-size: 13px;
    padding: 3px 8px 3px 9px;
    border-radius: 40px;
  }

  input:disabled {
    background-color: $background-color-highlight-1;
  }

  .delete-separator-col {
    min-width: 17px;
    svg {
      font-size: 1.5rem;
    }
  }
}
</style>
