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
        <recipe-order-by
          :recipe-filter="recipeFilter"
          @orderingUpdated="applyNewOrdering"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-facing-decorator";
import { Icon } from "@iconify/vue/dist/offline";
import RecipeFilterMenu from "./RecipeFilterMenu.vue";
import { RecipeFilter } from "../../clients/RecipesClient";
import RecipeOrderBy from "./RecipeOrderBy.vue";

@Component({
  components: { Icon, RecipeFilterMenu, RecipeOrderBy },
  emits: ["update-filter", "replace-filter"],
})
export default class RecipeFilterBar extends Vue {
  filterMenuOpen = false;
  @Prop({ required: true }) recipeFilter!: RecipeFilter;

  applyNewOrdering() {
    this.$emit("update-filter");
  }

  applyFilter(recipeFilter: RecipeFilter) {
    this.filterMenuOpen = false;
    this.$emit("replace-filter", recipeFilter);
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
