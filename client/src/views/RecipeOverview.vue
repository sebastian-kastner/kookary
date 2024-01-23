<template>
  <div id="recipe-overview" class="main-content">
    <recipe-filter-bar :recipe-filter="recipeFilter" @replaceFilter="onFilterReplace" @updateFilter="onFilterChanged" />
    <div id="active-filters-bar" class="container">
      <div class="d-flex align-items-center">
        <div class="inline-item-list">
          <div
            v-for="(activeFilter, index) in activeFilters"
            :key="index"
            class="inline-item-list-element"
          >
            <Icon :icon="activeFilter.icon" />
            {{ activeFilter.name }}
            <span class="item-delete" @click="removeFilter(activeFilter)">x</span>
          </div>
        </div>
      </div>
    </div>
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
import { filterHandlers, ActiveFilter } from "../components/recipe-filters/FilterHandlers";
import { Icon } from "@iconify/vue/dist/offline";
import RecipeList from "../components/RecipeList.vue";
import TypeaheadInput from "../components/TypeaheadInput.vue";
import RecipeFilterBar from "../components/recipe-filters/RecipeFilterBar.vue";
import { LocationQueryRaw } from "vue-router";

enum RecipeLoadType {
  Append,
  Replace,
}

@Component({
  components: {
    RecipeList,
    TypeaheadInput,
    RecipeFilterBar,
    Icon,
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

  activeFilters: ActiveFilter[] = [];

  recipes: Recipe[] = [];
  recipeClient = new RecipesClient();

  hasMoreRecipes = false;
  page = 1;
  isLoading = false;

  @Watch("$route.query", { deep: true })
  onRouteParamsChange() {
    this.updateFilterFromRoute().then(() => {
      this.reloadRecipes();
    });
  }

  mounted(): void {
    this.updateFilterFromRoute().then(() => {
      this.reloadRecipes();
    });
  }

  private async updateFilterFromRoute(): Promise<void> {
    // use for loop instead of forEach for easier async handling
    for (const filter of filterHandlers) {
      const routeParam = this.$route.query[filter.name];
      if (routeParam !== undefined) {
        let val = "";
        if (routeParam) {
          val = routeParam.toString();
        }
        await filter.applyRouteFilter(val, this.recipeFilter);
      }
    }
    this.reloadActiveFilters();
  }

  public async onFilterChanged(): Promise<void> {
    this.udapteRouteFromFilter();
    return this.reloadRecipes();
  }

  public async onFilterReplace(newFilter: RecipeFilter): Promise<void> {
    this.recipeFilter = newFilter;
    this.onFilterChanged();
  }
  
  private reloadActiveFilters(): void {
    const newFilters: ActiveFilter[] = [];
    filterHandlers.forEach((handler) => {
      newFilters.push(...handler.getActiveFilters(this.recipeFilter));
    });
    this.activeFilters = newFilters;
  }

  private udapteRouteFromFilter(): void {
    const newRoute: LocationQueryRaw = {};
    filterHandlers.forEach((filter) => {
      const routeParamVal = filter.getRouteParams(this.recipeFilter);
      if (routeParamVal) {
        newRoute[filter.name] = routeParamVal;
      }
    });
    this.$router.push({ query: newRoute });
  }

  removeFilter(filter: ActiveFilter) {
    filter.remove();
    this.activeFilters.splice(this.activeFilters.indexOf(filter), 1);
    this.onFilterChanged();
  }

  public async reloadRecipes(): Promise<void> {
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
../components/recipe-filters/FilterHandlers