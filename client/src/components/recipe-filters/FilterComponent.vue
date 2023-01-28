<template>
  <div id="filter-component" class="container">
    <div class="row filter-bar">
      <div
        v-for="(filter, index) in filters"
        v-bind:key="filter.name"
        :class="[isSelectedClass(filter.name), getFilterClass(index)]"
        class="col filter-icon"
      >
        <div class="row" v-on:click="showFilter(filter.name)">
          <div class="col">
            <component :is="filter.icon" />
          </div>
          <div
            class="col delete-filter"
            @click="
              filter.isActive(recipeFilter)
                ? resetFilter($event, filter.resetFilter)
                : null
            "
          >
            <b-icon-x-circle v-if="filter.isActive(recipeFilter)" />
          </div>
        </div>
      </div>
    </div>

    <div v-for="filter in filters" v-bind:key="filter.name">
      <component
        :is="filter.component"
        v-if="activeFilter == filter.name"
        class="filter-details"
        @applyFilter="applyFilter"
        :recipeFilter="recipeFilter"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  BIconXCircle,
  BIconBellFill,
} from "bootstrap-vue";
import { Component, Prop, Vue } from "vue-property-decorator";
import { RecipeFilter } from "../../clients/RecipesClient";
import { UiFilter } from './uiFilters'

@Component({
  components: {
    BIconXCircle,
    BIconBellFill,
  },
})
export default class FilterComponent extends Vue {
  @Prop({ required: true }) recipeFilter!: RecipeFilter;

  @Prop({required: true }) filters!: UiFilter[];

  activeFilter: string | null = "name";

  resetFilter(
    event: PointerEvent,
    resetFunction: (filter: RecipeFilter) => void
  ): void {
    event.stopPropagation();
    resetFunction(this.recipeFilter);
    this.applyFilter();
  }

  showFilter(name: string) {
    this.activeFilter = name;
  }

  isSelectedClass(name: string) {
    if (this.activeFilter === name) {
      return "active-filter";
    }
    return "";
  }

  getFilterClass(filterIndex: number): string {
    return "filter-icon-" + (filterIndex + 1);
  }

  applyFilter(): void {
    this.$emit("applyFilter");
  }
}
</script>

<style lang="scss" scoped>
@import "../../../main.scss";

$base-color: #534f63;
$highlight-color: $background-color-main;
$bottom-border: 3px;

#filter-component {
  .filter-bar {
    border-bottom: $bottom-border solid $base-color;
  }

  .filter-details {
    background-color: $highlight-color;
    padding-top: 15px;
    padding-bottom: 15px;
    min-height: 80px;
  }

  .filter-icon {
    text-align: center;
    font-size: 1.5rem;
    padding-top: 1px;
    padding-bottom: 2px;
    margin-right: 0px;
    margin-top: -1px;

    svg {
      fill: $background-color-main;
    }

    &.active-filter {
      background-color: $highlight-color;
      margin-bottom: -$bottom-border - 1;

      svg {
        fill: $button-color-main;
      }
    }

    .delete-filter {
      font-size: 0.9rem;
      display: inline-block;
      margin-top: 4px;
      padding-left: 25px;
    }
  }

  $lightening_factor: 12;

  .filter-icon-1 {
    background-color: lighten($base-color, ($lightening_factor * 0));
  }

  .filter-icon-2 {
    background-color: lighten($base-color, ($lightening_factor * 1));
  }

  .filter-icon-3 {
    background-color: lighten($base-color, ($lightening_factor * 2));
  }

  .filter-icon-4 {
    background-color: lighten($base-color, ($lightening_factor * 3));
  }

  .filter-icon-5 {
    background-color: lighten($base-color, ($lightening_factor * 4));
  }
}
</style>
