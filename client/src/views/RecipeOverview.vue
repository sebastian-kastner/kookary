<template>
  <div id="recipe-overview" class="main-content">
    <filter-component
      :recipe-filter="recipeFilter"
      :filters="filters"
      @applyFilter="applyFilter"
    />
    <br />
    <recipe-list :recipes="recipes" />
    <div v-if="hasMoreRecipes" class="d-flex justify-content-center">
      <button
        type="button"
        class="btn rounded-button"
        :disabled="isLoading"
        @click="loadNextPage"
      >
        Mehr...
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { RecipesClient, RecipeFilter } from "../clients/RecipesClient";
import { Ingredient, Recipe } from "../types";
import { ingredientStore } from "../stores/rootStore";
import {
  UiFilter,
  nameFilter,
  ingredientFilter,
  seasonalFilter,
  tagFilter,
  markedFilter,
} from "../components/recipe-filters/uiFilters";
import { userStore } from "../stores/rootStore";
import RecipeList from "../components/RecipeList.vue";
import TypeaheadInput from "../components/TypeaheadInput.vue";
import FilterComponent from "../components/recipe-filters/FilterComponent.vue";

enum RecipeLoadType {
  Append,
  Replace,
}

@Options({
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

  recipes: Recipe[] = [];
  recipeClient = new RecipesClient();

  hasMoreRecipes = false;
  page = 1;
  isLoading = false;

  mounted(): void {
    this.filters.forEach((filter) => {
      const routeParam = this.$route.query[filter.name];
      if (routeParam !== undefined) {
        let val = "";
        if (routeParam) {
          val = routeParam.toString();
        }
        filter.applyRouteFilter(val, this.recipeFilter);
      }
    });

    this.applyFilter();
  }

  get filters(): UiFilter[] {
    const filters: UiFilter[] = [
      nameFilter,
      tagFilter,
      ingredientFilter,
      seasonalFilter,
    ];

    if (userStore.user && userStore.user.id) {
      filters.push(markedFilter);
    }

    return filters;
  }

  public async applyFilter(): Promise<void> {
    this.recipeFilter.page = 1;
    this.loadRecipes(RecipeLoadType.Replace);
  }

  private async loadRecipes(loadType: RecipeLoadType): Promise<void> {
    this.isLoading = true;
    this.recipeClient
      .getRecipes(this.recipeFilter)
      .then((ret) => {
        if (loadType === RecipeLoadType.Append) {
          this.recipes.push(...ret.recipes);
        } else {
          this.recipes = ret.recipes;
        }
        this.hasMoreRecipes = ret.hasMoreItems;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  public async loadNextPage(): Promise<void> {
    let currentPage = this.recipeFilter.page;
    if (!currentPage) {
      currentPage = 1;
    }

    this.recipeFilter.page = currentPage + 1;
    this.loadRecipes(RecipeLoadType.Append);
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
@import "../styles/variables.scss";
</style>
