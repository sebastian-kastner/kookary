<template>
  <div class="row text-center">
    <div class="col-8">
      <input
        type="text"
        class="form-control"
        placeholder="Name"
        v-model="internalValue"
        v-on:blur="updateFilter"
        @keydown.enter.tab.prevent="updateFilter"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { RecipeFilter } from "../../clients/RecipesClient";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {},
})
export default class NameFilterComponent extends Vue {
  @Prop({ required: true }) recipeFilter!: RecipeFilter;

  internalValue = "";

  mounted(): void {
    this.internalValue = this.recipeFilter.nameContains;
  }

  updateFilter(): void {
    this.recipeFilter.nameContains = this.internalValue;
    this.applyFilter();
  }

  applyFilter(): void {
    this.$emit("applyFilter");
  }

}
</script>
