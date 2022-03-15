<template>
  <div>
    <div class="row filter-bar">
      <div
        v-for="filter in filters"
        v-bind:key="filter.name"
        :class="isSelectedClass(filter.name)"
        class="col filter-icon"
      >
        <div class="row" v-on:click="showFilter(filter.name)">
          <div class="col">
            <component :is="filter.icon" />
          </div>
          <div
            class="col delete-filter"
            @click="filter.isActive() ? resetFilter($event, filter.resetFilter) : null"
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
} from "bootstrap-vue";
import { Component, Prop, Vue } from "vue-property-decorator";
import { RecipeFilter } from "../../clients/RecipesClient";
import NameFilterComponent from "./NameFilterComponent.vue";
import TagFilterComponent from "./TagFilterComponent.vue";
import IsSeasonalFilterComponent from "./IsSeasonalFilterComponent.vue";
import IngredientFilterComponent from "./IngredientFilterComponent.vue";

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
  },
})
export default class FilterComponent extends Vue {
  private activeFilter: string | null = "name";

  recipeFilter: RecipeFilter = {
    tags: [],
    ingredients: [],
    nameContains: "",
    isSeasonal: false,
  };

  private filters: UiFilter[] = [
    {
      name: "name",
      icon: BIconInputCursor,
      component: NameFilterComponent,
      isActive: () => this.recipeFilter.nameContains.length > 0,
      resetFilter: () => (this.recipeFilter.nameContains = ""),
    },
    {
      name: "tags",
      icon: BIconTags,
      component: TagFilterComponent,
      isActive: () => this.recipeFilter.tags.length > 0,
      resetFilter: () => (this.recipeFilter.tags = []),
    },
    {
      name: "ingredients",
      icon: BIconBag,
      component: IngredientFilterComponent,
      isActive: () => this.recipeFilter.ingredients.length > 0,
      resetFilter: () => (this.recipeFilter.ingredients = []),
    },
    {
      name: "seasonal",
      icon: BIconCalendarWeek,
      component: IsSeasonalFilterComponent,
      isActive: () => this.recipeFilter.isSeasonal === true,
      resetFilter: () => (this.recipeFilter.isSeasonal = false),
    },
  ];

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

  applyFilter(): void {
    this.$emit("applyFilter", this.recipeFilter);
  }
}
</script>

<style lang="scss" scoped>
$base-color: lightgreen;
$bottom-border: 3px;

.filter-bar {
  border-bottom: $bottom-border solid $base-color;
  margin-top: 10px;
}

.filter-details {
  background-color: lightblue;
  padding-top: 15px;
  padding-bottom: 15px;
}

.filter-icon {
  background-color: $base-color;
  text-align: center;
  font-size: 1.5rem;
  border-top-left-radius: 1.1rem;
  border-top-right-radius: 1.1rem;
  margin-left: 10px;
  margin-right: 10px;

  &.active-filter {
    background-color: lightblue;
    margin-bottom: -$bottom-border;
  }

  .delete-filter {
    font-size: 0.9rem;
    display: inline-block;
  }
}
</style>
