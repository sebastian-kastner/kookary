<template>
  <div id="filter-component" class="container">
    <div class="row filter-bar">
      <div
        v-for="(filter, index) in filters"
        v-bind:key="filter.name"
        :class="[ isSelectedClass(filter.name), getFilterClass(index) ]"
        class="col filter-icon"
      >
        <div class="row" v-on:click="showFilter(filter.name)">
          <div class="col">
            <component :is="filter.icon" />
          </div>
          <div
            class="col delete-filter"
            @click="
              filter.isActive() ? resetFilter($event, filter.resetFilter) : null
            "
          >
            <b-icon-x-circle v-if="filter.isActive()" />
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
  BIconInputCursor,
  BIconTags,
  BIconBag,
  BIconCalendarWeek,
  BIconXCircle,
  BIconBellFill,
} from "bootstrap-vue";
import { Component, Vue } from "vue-property-decorator";
import { RecipeFilter } from "../../clients/RecipesClient";
import NameFilterComponent from "./NameFilterComponent.vue";
import TagFilterComponent from "./TagFilterComponent.vue";
import IsSeasonalFilterComponent from "./IsSeasonalFilterComponent.vue";
import IngredientFilterComponent from "./IngredientFilterComponent.vue";
import IsMarkedFilterComponent from "./IsMarkedFilterComponent.vue";

type UiFilter = {
  name: string;
  icon: unknown;
  component: unknown;
  isActive: () => boolean;
  resetFilter: () => void;
};

@Component({
  components: {
    BIconInputCursor,
    BIconTags,
    BIconBag,
    BIconCalendarWeek,
    BIconXCircle,
    NameFilterComponent,
    TagFilterComponent,
    IngredientFilterComponent,
    IsSeasonalFilterComponent,
    IsMarkedFilterComponent,
    BIconBellFill,
  },
})
export default class FilterComponent extends Vue {
  private activeFilter: string | null = "name";

  recipeFilter: RecipeFilter = {
    tags: [],
    ingredients: [],
    nameContains: "",
    isSeasonal: false,
    marked: null,
  };

  private filters: UiFilter[] = [
    {
      name: "name",
      icon: BIconInputCursor,
      component: NameFilterComponent,
      isActive: () => this.hasElements(this.recipeFilter.nameContains),
      resetFilter: () => (this.recipeFilter.nameContains = ""),
    },
    {
      name: "tags",
      icon: BIconTags,
      component: TagFilterComponent,
      isActive: () => this.hasElements(this.recipeFilter.tags),
      resetFilter: () => (this.recipeFilter.tags = []),
    },
    {
      name: "ingredients",
      icon: BIconBag,
      component: IngredientFilterComponent,
      isActive: () => this.hasElements(this.recipeFilter.ingredients),
      resetFilter: () => (this.recipeFilter.ingredients = []),
    },
    {
      name: "seasonal",
      icon: BIconCalendarWeek,
      component: IsSeasonalFilterComponent,
      isActive: () => this.recipeFilter.isSeasonal === true,
      resetFilter: () => (this.recipeFilter.isSeasonal = false),
    },
    {
      name: "marked",
      icon: BIconBellFill,
      component: IsMarkedFilterComponent,
      isActive: () => this.recipeFilter.marked !== null,
      resetFilter: () => (this.recipeFilter.marked = null),
    },
  ];

  hasElements(list: Array<object> | string | undefined): boolean {
    if (list) {
      return list.length > 0;
    }
    return false;
  }

  resetFilter(event: PointerEvent, resetFunction: () => void): void {
    event.stopPropagation();
    resetFunction();
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
    this.$emit("applyFilter", this.recipeFilter);
  }
}
</script>

<style lang="scss" scoped>
@import "../../../main.scss";

$base-color: #534F63;
$highlight-color: white;
$bottom-border: 3px;

#filter-component {
  padding-top: 15px;

  .filter-bar {
    border-bottom: $bottom-border solid $base-color;
  }

  .filter-details {
    background-color: $highlight-color;
    padding-top: 15px;
    padding-bottom: 15px;
  }

  .filter-icon {
    background-color: $base-color;
    text-align: center;
    font-size: 1.5rem;
    padding-top: 3px;
    padding-bottom: 3px;

    svg {
      fill: white;
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
