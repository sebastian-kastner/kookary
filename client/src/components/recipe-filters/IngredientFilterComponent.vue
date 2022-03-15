<template>
  <div class="row">
    <div class="col-8">
      <inline-item-list
          :suggestItems="existingIngredients"
          :items="recipeFilter.ingredients"
          :provideId="getIngredientId"
          @itemSelected="applyFilter"
          @itemDeleted="applyFilter"
        />
    </div>
    <div class="col text-center">
      <button type="button" class="btn btn-primary" v-on:click="applyFilter">&check;</button>
    </div>
    <div class="col text-center">
      <button type="button" class="btn btn-primary" v-on:click="resetFilter">&Cross;</button>
    </div>
  </div>
</template>

<script lang="ts">
import { RecipeFilter } from "../../clients/RecipesClient";
import { Vue, Component, Prop } from "vue-property-decorator";
import InlineItemList from "../InlineItemList.vue";
import { ingredientStore } from "../../stores/rootStore";
import { Ingredient } from "../../types";
import {v4 as uuid} from 'uuid';

@Component({
  components: { InlineItemList },
})
export default class IngredientFilterComponent extends Vue {
  @Prop({ required: true }) recipeFilter!: RecipeFilter;

  get existingIngredients(): Ingredient[] {
    return ingredientStore.ingredients;
  }

  applyFilter(): void {
    this.$emit("applyFilter");
  }

  resetFilter(): void {
    this.recipeFilter.ingredients = [];
    this.$emit("applyFilter");
  }

  getIngredientId(ingredient: Ingredient): string {
    if(ingredient.ingredientId) {
      return ingredient.ingredientId.toString();
    }
    return uuid();
  }
}
</script>
