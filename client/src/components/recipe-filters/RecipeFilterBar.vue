<template>
  <recipe-filter-menu
    :filter-menu-open="filterMenuOpen"
    :active-filter="recipeFilter"
    @close-menu="filterMenuOpen = false"
    @apply-filter="applyFilter"
  />
  <div id="recipe-filter-bar" class="container my-2">
    <div class="d-flex justify-content-between">
      <div class="d-flex align-items-center">
        <span role="button" @click="filterMenuOpen = true">
          <Icon icon="filter" class="me-2" /> Filter
        </span>
      </div>
      <div class="form-floating">
        <!-- FIXME: extract into separate component -->
        <select id="sort-by-select" class="form-select">
          <option value="name">Datum</option>
          <option value="datum">Zuletzt gekocht</option>
          <option value="seasonality">Saisonalität</option>
        </select>
        <label for="sort-by-select">Sortieren nach</label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-facing-decorator";
import { Icon } from "@iconify/vue/dist/offline";
import RecipeFilterMenu from "./RecipeFilterMenu.vue";
import { RecipeFilter } from "../../clients/RecipesClient";

@Component({
  components: { Icon, RecipeFilterMenu },
})
export default class RecipeFilterBar extends Vue {
  filterMenuOpen = false;

  recipeFilter: RecipeFilter = {
    tags: [],
    ingredients: [],
    nameContains: "",
    isSeasonal: false,
    marked: false,
  };

  applyFilter(recipeFilter: RecipeFilter) {
    this.recipeFilter = recipeFilter;
    this.filterMenuOpen = false;
    console.log("applying filter", recipeFilter);
    // TODO: update recipes
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";

#recipe-filter-bar {
  background-color: $background-color-main;
  color: black;

  span:hover {
    svg {
      background-color: darken($button-color-main, 15%);
    }
  }

  svg {
    background-color: $button-color-main;
    padding: 4px 6px;
    border-radius: 4px;
    color: white;
    font-size: 2.2rem;
  }
}
</style>
