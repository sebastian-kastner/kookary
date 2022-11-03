<template>
  <div id="recipe-overview" class="main-content">
    <filter-component 
      @applyFilter="applyFilter"
    />
    <br />
    <recipe-list :recipes="recipes" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RecipesClient, RecipeFilter } from "../clients/RecipesClient";
import { Ingredient, Recipe } from "../types";
import RecipeList from "../components/RecipeList.vue";
import TypeaheadInput from "../components/TypeaheadInput.vue";
import FilterComponent from "../components/recipe-filters/FilterComponent.vue";
import { ingredientStore } from "../stores/rootStore";

@Component({
  components: { RecipeList, TypeaheadInput, FilterComponent },
})
export default class RecipesView extends Vue {
  recipes: Recipe[] = [];
  recipeClient = new RecipesClient();

  mounted(): void {
    this.recipeClient.getRecipes().then((ret) => {
      this.recipes = ret;
    });
  }

  public async applyFilter(filter: RecipeFilter): Promise<void> {
    this.recipeClient.getRecipes(filter).then((ret) => {
      this.recipes = ret;
    });
  }

  get existingIngredients(): Ingredient[] {
    return ingredientStore.ingredients;
  }

  getIngredientLabel(ingredient: Ingredient | undefined): string {
    if (ingredient && ingredient.name) {
      return ingredient.name;
    }
    return "";
  }
}
</script>

<style lang="scss" scoped>
@import "../../main.scss";

</style>

