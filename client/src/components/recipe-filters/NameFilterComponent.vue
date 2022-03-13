<template>
  <div class="row text-center">
    <div class="col-8">
      <input type="text" class="form-control" placeholder="Name" v-model="recipeFilter.nameContains" />
    </div>
    <div class="col">
      <button type="button" class="btn btn-primary" v-on:click="applyFilter">&check;</button>
    </div>
    <div class="col">
      <button type="button" class="btn btn-primary" v-on:click="resetFilter">&Cross;</button>
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

  applyFilter(): void {
    this.$emit("applyFilter");
  }

  resetFilter(): void {
    if(this.recipeFilter.nameContains && this.recipeFilter.nameContains != "") {
      this.recipeFilter.nameContains = "";
    }
    this.$emit("applyFilter");
  }
}
</script>
