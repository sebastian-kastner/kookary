<template>
  <div class="filter-menu-row-head"><Icon icon="bag" />Zutaten</div>
  <div class="filter-menu-row-body">
    <inline-item-list
      :suggest-items="existingIngredients"
      :items="recipeFilter.ingredients"
      :provide-id="getIngredientId"
      :input-placeholder="inputPlaceholder"
      @itemSelected="filterUpdated"
      @itemDeleted="filterUpdated"
    />
  </div>
</template>

<script lang="ts">
import { RecipeFilter } from "../../clients/RecipesClient";
import { Vue, Component, Prop } from "vue-facing-decorator";
import InlineItemList from "../InlineItemList.vue";
import { ingredientStore } from "../../stores/rootStore";
import { Ingredient } from "../../types";
import { v4 as uuid } from "uuid";

@Component({
  components: { InlineItemList },
  emits: ["filterUpdated"],
})
export default class IngredientFilterComponent extends Vue {
  @Prop({ required: true }) recipeFilter!: RecipeFilter;

  typeaheadValue = "";
  inputPlaceholder = "Zutatenname...";

  get existingIngredients(): Ingredient[] {
    return ingredientStore.ingredients;
  }

  filterUpdated(): void {
    this.$emit("filterUpdated");
  }

  getIngredientId(ingredient: Ingredient): string {
    if (ingredient.ingredientId) {
      return ingredient.ingredientId.toString();
    }
    return uuid();
  }
}
</script>
