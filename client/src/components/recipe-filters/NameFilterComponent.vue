<template>
  <div class="filter-menu-row-head"><Icon icon="cursor" />Rezeptname</div>
  <div class="filter-menu-row-body">
    <div
      v-if="recipeFilter.nameContains && recipeFilter.nameContains !== ''"
      class="inline-item-list-element"
    >
      {{ recipeFilter.nameContains }}
      <span class="item-delete" @click="resetFilter">x</span>
    </div>
    <input
      v-else
      v-model="internalValue"
      type="text"
      class="form-control"
      placeholder="In Rezeptnamen suchen nach..."
      @blur="updateFilter"
      @keydown.enter.tab.prevent="updateFilter"
      @keydown.esc.prevent="resetFilter"
    />
  </div>
</template>

<script lang="ts">
import { RecipeFilter } from "../../clients/RecipesClient";
import { Vue, Component, Prop } from "vue-facing-decorator";

@Component({
  components: {},
  emits: ["filterUpdated"],
})
export default class NameFilterComponent extends Vue {
  @Prop({ required: true }) recipeFilter!: RecipeFilter;
  internalValue = "";

  mounted(): void {
    if (this.recipeFilter.nameContains) {
      this.internalValue = this.recipeFilter.nameContains;
    }
  }

  updateFilter(): void {
    this.recipeFilter.nameContains = this.internalValue;
    this.emitFilterUpdated();
  }

  emitFilterUpdated(): void {
    this.$emit("filterUpdated");
  }

  resetFilter(): void {
    this.internalValue = "";
    this.recipeFilter.nameContains = "";
    this.emitFilterUpdated();
  }
}
</script>

<style lang="scss" scoped>
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
</style>