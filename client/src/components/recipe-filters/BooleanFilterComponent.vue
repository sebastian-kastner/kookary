<template>
  <div class="filter-menu-row-head">
    <Icon :icon="icon" />{{ title }}
  </div>
  <div class="filter-menu-row-body">
    <div class="form-check">
      <input
        :id="checkboxId"
        v-model="internalValue"
        class="form-check-input"
        type="checkbox"
        value=""
        @change="emitValueChanged"
      />
      <label class="form-check-label" :for="checkboxId">
        {{ label }}
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import { RecipeFilter } from "../../clients/RecipesClient";
import { Vue, Component, Prop } from "vue-facing-decorator";

@Component({
  components: {},
  emits: ["valueChanged"],
})
export default class BooleanFilterComponent extends Vue {
  @Prop({ required: true }) recipeFilter!: RecipeFilter;
  @Prop({ required: true }) icon!: string;
  @Prop({ required: true }) title!: string;
  @Prop({ required: true }) label!: string;
  @Prop({ required: true }) checkboxId!: string;
  @Prop({ required: true }) flag!: boolean;

  internalValue = false;

  mounted(): void {
    if (this.flag) {
      this.internalValue = this.flag;
    } else {
      this.internalValue = false;
    }
  }
  
  emitValueChanged(): void {
    this.$emit("valueChanged", this.internalValue);
  }
}
</script>
