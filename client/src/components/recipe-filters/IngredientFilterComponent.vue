<template>
  <div class="row">
    <div class="col-12">
      <inline-item-list
        :suggestItems="existingIngredients"
        :items="recipeFilter.ingredients"
        :provideId="getIngredientId"
        :inputPlaceholder="inputPlaceholder"
        @itemSelected="applyFilter"
        @itemDeleted="applyFilter"
      />
    </div>
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
})
export default class IngredientFilterComponent extends Vue {
  @Prop({ required: true }) recipeFilter!: RecipeFilter;

  inputPlaceholder = "Zutatenname...";

  get existingIngredients(): Ingredient[] {
    return ingredientStore.ingredients;
  }

  applyFilter(): void {
    this.$emit("applyFilter");
  }

  getIngredientId(ingredient: Ingredient): string {
    if (ingredient.ingredientId) {
      return ingredient.ingredientId.toString();
    }
    return uuid();
  }
}
</script>
