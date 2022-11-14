<template>
  <div id="recipe-overview" class="main-content">
    <filter-component 
      :recipeFilter="recipeFilter"
      :filters="uiFilters"
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
import { ingredientStore } from "../stores/rootStore";
import { filters } from '../components/recipe-filters/uiFilters'
import RecipeList from "../components/RecipeList.vue";
import TypeaheadInput from "../components/TypeaheadInput.vue";
import FilterComponent from "../components/recipe-filters/FilterComponent.vue";

@Component({
  components: { RecipeList, TypeaheadInput, FilterComponent },
})
export default class RecipesView extends Vue {
  
  recipeFilter: RecipeFilter = {
    tags: [],
    ingredients: [],
    nameContains: "",
    isSeasonal: false,
    marked: false,
  };

  uiFilters = filters;

  recipes: Recipe[] = [];
  recipeClient = new RecipesClient();

  mounted(): void {
    this.uiFilters.forEach((filter) => {
      const routeParam = this.$route.query[filter.name];
      if (routeParam !== undefined) {
        let val = '';
        if (routeParam) {
          val = routeParam.toString();
        }
        filter.applyRouteFilter(val, this.recipeFilter);
      }
    });

    this.applyFilter(this.recipeFilter);
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

