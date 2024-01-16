<template>
  <div v-if="filterMenuOpen" id="filter-menu" class="p-4">
    <div class="d-flex justify-content-between">
      <h3>Filtern & Sortieren</h3>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        @click="closeMenu"
      ></button>
    </div>
    <div class="filter-menu-row">
      <recipe-order-by
        :recipe-filter="localFilter"
        @orderingUpdated="onFilterUpdate"
      />
    </div>
    <div class="filter-menu-row">
      <name-filter-component
        :recipe-filter="localFilter"
        @filterUpdated="onFilterUpdate"
      />
    </div>
    <div class="filter-menu-row">
      <boolean-filter-component
        :recipe-filter="localFilter"
        icon="calendarWeek"
        title="Saisonalität"
        label="Nur saisonale Rezepte"
        checkbox-id="is-seasonal-filter"
        :flag="localFilter?.isSeasonal"
        @valueChanged="updateIsSeasonalFilter"
      />
    </div>
    <div class="filter-menu-row">
      <ingredient-filter-component
        :recipe-filter="localFilter"
        @filterUpdated="onFilterUpdate"
      />
    </div>
    <div class="filter-menu-row">
      <tag-filter-component
        :recipe-filter="localFilter"
        @filterUpdated="onFilterUpdate"
      />
    </div>
    <div class="filter-menu-row">
      <boolean-filter-component
        :recipe-filter="localFilter"
        icon="bell"
        title="Merkliste"
        label="Nur Rezepte auf Merkliste"
        checkbox-id="is-marked-filter"
        :flag="localFilter?.marked"
        @valueChanged="updateIsMarkedFilter"
      />
    </div>
    <div class="py-4">
      <button
        type="button"
        class="apply-filter btn btn-outline-primary"
        @click="applyFilter"
      >
        Filtern!
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-facing-decorator";
import { RecipeFilter } from "../../clients/RecipesClient";
import { Icon } from "@iconify/vue/dist/offline";
import cloneDeep from "lodash.clonedeep";

import RecipeOrderBy from "./RecipeOrderBy.vue";
import NameFilterComponent from "./NameFilterComponent.vue";
import BooleanFilterComponent from "./BooleanFilterComponent.vue";
import IngredientFilterComponent from "./IngredientFilterComponent.vue";
import TagFilterComponent from "./TagFilterComponent.vue";

@Component({
  components: {
    Icon,
    RecipeOrderBy,
    NameFilterComponent,
    BooleanFilterComponent,
    IngredientFilterComponent,
    TagFilterComponent,
  },
})
export default class RecipeFilterMenu extends Vue {
  @Prop({ required: true }) filterMenuOpen!: boolean;
  @Prop({ required: true }) activeFilter!: RecipeFilter;

  localFilter: RecipeFilter | null = null;

  @Watch("filterMenuOpen")
  onFilterMenuOpenChanged() {
    if (this.filterMenuOpen) {
      console.log("cloning filter for edit..");
      this.localFilter = cloneDeep(this.activeFilter);
    }
  }

  closeMenu(): void {
    this.$emit("close-menu");
  }

  onFilterUpdate(): void {
    console.log(this.localFilter);
  }

  updateIsSeasonalFilter(newVal: boolean): void {
    if (this.localFilter) {
      this.localFilter.isSeasonal = newVal;
    }
    this.onFilterUpdate();
  }

  updateIsMarkedFilter(newVal: boolean): void {
    if (this.localFilter) {
      this.localFilter.marked = newVal;
    }
    this.onFilterUpdate();
  }

  applyFilter() {
    if (!this.localFilter) {
      this.$emit("close-menu");
      return;
    }
    this.$emit("apply-filter", this.activeFilter);
  }
}
</script>

<style lang="scss">
@import "../../styles/variables.scss";

#filter-menu {
  position: fixed;
  top: 0;
  left: 0;
  min-width: 450px;
  height: 100vh;
  background-color: white;
  z-index: 9999;
  color: black;
  border: 1px solid darkgray;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;

  .filter-menu-row {
    border-bottom: 1px solid lightgray;
    padding: 15px 0;

    .filter-menu-row-head {
      font-weight: bold;
      padding-bottom: 5px;
      display: flex;
      align-items: center;

      svg {
        margin-right: 5px;
        font-size: 1.1rem;
      }
    }
  }

  .apply-filter {
    width: 100%;
  }
}
</style>
