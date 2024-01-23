<template>
  <VueFinalModal
    class="vfm-modal"
    content-class="vfm-modal-content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
  >
    <div id="filter-menu" class="p-4">
      <div class="d-flex justify-content-between">
        <h3>Filtern & Sortieren</h3>
        <button
          type="button"
          class="btn-close"
          aria-label="Close"
          @click="closeMenu"
        ></button>
      </div>
      <div class="scrollable-filters">
        <div class="filter-menu-row">
          <recipe-order-by :recipe-filter="localFilter" />
        </div>
        <div class="filter-menu-row">
          <name-filter-component :recipe-filter="localFilter" />
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
          <ingredient-filter-component :recipe-filter="localFilter" />
        </div>
        <div class="filter-menu-row">
          <tag-filter-component :recipe-filter="localFilter" />
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
      </div>
      <div class="apply-filter">
        <button
          type="button"
          class="btn btn-outline-primary"
          @click="applyFilter"
        >
          Filtern!
        </button>
      </div>
    </div>
  </VueFinalModal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-facing-decorator";
import { RecipeFilter } from "../../clients/RecipesClient";

import { VueFinalModal } from "vue-final-modal";
import RecipeOrderBy from "./RecipeOrderBy.vue";
import NameFilterComponent from "./NameFilterComponent.vue";
import BooleanFilterComponent from "./BooleanFilterComponent.vue";
import IngredientFilterComponent from "./IngredientFilterComponent.vue";
import TagFilterComponent from "./TagFilterComponent.vue";

@Component({
  components: {
    VueFinalModal,
    RecipeOrderBy,
    NameFilterComponent,
    BooleanFilterComponent,
    IngredientFilterComponent,
    TagFilterComponent,
  },
  emits: ["apply", "close"],
})
export default class RecipeFilterMenu extends Vue {
  @Prop({ required: true }) localFilter!: RecipeFilter;

  closeMenu(): void {
    this.$emit("close");
  }

  updateIsSeasonalFilter(newVal: boolean): void {
    if (this.localFilter) {
      this.localFilter.isSeasonal = newVal;
    }
  }

  updateIsMarkedFilter(newVal: boolean): void {
    if (this.localFilter) {
      this.localFilter.marked = newVal;
    }
  }

  applyFilter() {
    if (!this.localFilter) {
      this.$emit("close");
      return;
    }
    this.$emit("apply", this.localFilter);
  }
}
</script>

<style lang="scss">
@import "../../styles/variables.scss";
@import "../../styles/breakpoints.scss";

// extra styling on xs
@include media-breakpoint-down(sm) {
  #filter-menu {
    min-width: 100%;
  }
}

@include media-breakpoint-up(sm) {
  #filter-menu {
    width: 500px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }
}

.vfm-modal-content {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  margin: 0;
  padding: 0;
  max-height: 100%;
  background-color: transparent;
  border: none;

  #filter-menu {
    display: flex;
    flex-direction: column;
    background-color: white;
    color: black;
    border: 1px solid darkgray;
    height: 100%;

    .scrollable-filters {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
    }

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
  }

  .apply-filter {
    text-align: center;
    padding: 10px;

    button {
      width: 100%;
    }
  }
}
</style>
