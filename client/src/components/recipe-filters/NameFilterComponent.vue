<template>
  <div class="row text-center">
    <div class="col-12">
      <input
        v-model="internalValue"
        type="text"
        class="form-control"
        placeholder="Name"
        @blur="updateFilter"
        @keydown.enter.tab.prevent="updateFilter"
        @keydown.esc.prevent="resetFilter"
      >
    </div>
  </div>
</template>

<script lang="ts">
import { RecipeFilter } from "../../clients/RecipesClient";
import { Vue, Component, Prop, Watch } from "vue-facing-decorator";

@Component({
  components: {},
})
export default class NameFilterComponent extends Vue {
  @Prop({ required: true }) recipeFilter!: RecipeFilter;
  internalValue = "";

  @Watch('recipeFilter.nameContains')
  filterValueChanges(): void {
    console.log("filter value changed:", this.recipeFilter.nameContains);
    if (this.recipeFilter.nameContains) {
      this.internalValue = this.recipeFilter.nameContains;
    }
  }

  mounted(): void {
    if (this.recipeFilter.nameContains) {
      this.internalValue = this.recipeFilter.nameContains;
    }
  }

  updateFilter(): void {
    this.recipeFilter.nameContains = this.internalValue;
    this.applyFilter();
  }

  applyFilter(): void {
    this.$emit("applyFilter");
  }

  resetFilter(): void {
    this.internalValue = "";
    this.recipeFilter.nameContains = "";
    this.applyFilter();
  }
}
</script>
