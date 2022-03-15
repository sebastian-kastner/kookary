<template>
  <div>
    <div class="row filter-bar">
      <!-- name filter tab -->
      <div class="col filter-icon" :class="getActiveClass('name')">
        <div class="row" v-on:click="showFilter('name')">
          <div class="col">
            <b-icon-input-cursor/>
          </div>
          <div class="col delete-filter" @click="activeFilter == 'name' ? deleteFilter('name') : null">
            <b-icon-x-circle v-if="activeFilter == 'name'"/>
          </div>
        </div>
      </div>
      <!-- tags filter tab -->
      <div class="col filter-icon" :class="getActiveClass('tags')">
        <div class="row" v-on:click="showFilter('tags')">
          <div class="col">
            <b-icon-tags />
          </div>
          <div class="col delete-filter" @click="activeFilter == 'tags' ? deleteFilter('tags') : null">
            <b-icon-x-circle v-if="activeFilter == 'tags'"/>
          </div>
        </div>
      </div>
      <!-- ingredients filter tab -->
      <div class="col filter-icon" :class="getActiveClass('ingredients')">
        <div class="row" v-on:click="showFilter('ingredients')">
          <div class="col">
            <b-icon-bag />
          </div>
          <div class="col delete-filter" @click="activeFilter == 'ingredients' ? deleteFilter('ingredients') : null">
            <b-icon-x-circle v-if="activeFilter == 'ingredients'"/>
          </div>
        </div>
      </div>
      <!-- seasonal filter tab -->
      <div class="col filter-icon" :class="getActiveClass('seasonal')">
        <div class="row" v-on:click="showFilter('seasonal')">
          <div class="col">
            <b-icon-calendar-week />
          </div>
          <div class="col delete-filter" @click="activeFilter == 'seasonal' ? deleteFilter('seasonal') : null">
            <b-icon-x-circle v-if="activeFilter == 'seasonal'"/>
          </div>
        </div>
      </div>
    </div>

    <name-filter-component 
      v-if="activeFilter == 'name'"
      class="filter-details"
      @applyFilter="applyFilter"
      :recipeFilter="recipeFilter"
    />
    <is-seasonal-filter-component
      v-else-if="activeFilter == 'seasonal'"
      class="filter-details"
      @applyFilter="applyFilter"
      :recipeFilter="recipeFilter"
    />
    <tag-filter-component
      v-else-if="activeFilter == 'tags'"
      class="filter-details"
      @applyFilter="applyFilter"
      :recipeFilter="recipeFilter"
    />
    <ingredient-filter-component
      v-else-if="activeFilter == 'ingredients'"
      class="filter-details"
      @applyFilter="applyFilter"
      :recipeFilter="recipeFilter"
    />
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
import { Component, Prop, Vue } from "vue-property-decorator"
import { RecipeFilter } from "../../clients/RecipesClient"
import NameFilterComponent from './NameFilterComponent.vue'
import TagFilterComponent from './TagFilterComponent.vue'
import IsSeasonalFilterComponent from './IsSeasonalFilterComponent.vue'
import IngredientFilterComponent from './IngredientFilterComponent.vue'

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
  private activeFilter: string | null = 'name';

  @Prop({ required: true }) recipeFilter!: RecipeFilter;

  showFilter(name: string) {
    this.activeFilter = name;
  }

  getActiveClass(name: string) {
    if(this.activeFilter === name) {
      return 'active-filter';
    }
    return '';
  }

  applyFilter(): void {
    this.activeFilter = null;
    this.$emit("applyFilter");
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
