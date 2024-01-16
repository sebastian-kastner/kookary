<template>
  <div id="recipe-overview" class="main-content">
    <recipe-filter-bar />
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
import { Vue, Component, Watch } from "vue-facing-decorator";
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
import RecipeFilterBar from "../components/recipe-filters/RecipeFilterBar.vue";

enum RecipeLoadType {
  Append,
  Replace,
}

@Component({
  components: {
    RecipeList,
    TypeaheadInput,
    RecipeFilterBar,
  },
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

  @Watch("$route.query", { deep: true })
  onRouteParamsChange() {
    this.applyRouteFilters();
  }

  mounted(): void {
    this.applyRouteFilters();
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

  private async applyRouteFilters(): Promise<void> {
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

    return this.applyFilter();
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
