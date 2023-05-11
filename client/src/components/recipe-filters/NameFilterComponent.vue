<template>
  <div class="row text-center">
    <div class="col-12">
      <input
        type="text"
        class="form-control"
        placeholder="Name"
        v-model="internalValue"
        v-on:blur="updateFilter"
        @keydown.enter.tab.prevent="updateFilter"
        @keydown.esc.prevent="resetFilter"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { RecipeFilter } from "../../clients/RecipesClient";
import { Prop } from "vue-facing-decorator";
import { Options, Vue } from "vue-class-component";

@Options({
  components: {},
})
export default class NameFilterComponent extends Vue {
  @Prop({ required: true }) recipeFilter!: RecipeFilter;

  internalValue = "";

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
