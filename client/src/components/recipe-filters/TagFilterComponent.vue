<template>
  <div class="row">
    <div class="col-8">
      <inline-item-list
          :suggestItems="existingTags"
          :items="recipeFilter.tags"
          @itemSelected="applyFilter"
          @itemDeleted="applyFilter"
        />
    </div>
    <div class="col text-center">
      <button type="button" class="btn btn-primary" v-on:click="applyFilter">&check;</button>
    </div>
    <div class="col text-center">
      <button type="button" class="btn btn-primary" v-on:click="resetFilter">&Cross;</button>
    </div>
  </div>
</template>

<script lang="ts">
import { RecipeFilter } from "../../clients/RecipesClient";
import { Vue, Component, Prop } from "vue-property-decorator";
import InlineItemList from "../InlineItemList.vue";
import { tagStore } from "../../stores/rootStore";
import { Tag } from "../../types";

@Component({
  components: { InlineItemList },
})
export default class NameFilterComponent extends Vue {
  @Prop({ required: true }) recipeFilter!: RecipeFilter;

  get existingTags(): Tag[] {
    return tagStore.tags;
  }

  applyFilter(): void {
    this.$emit("applyFilter");
  }

  resetFilter(): void {
    this.recipeFilter.tags = [];
    this.$emit("applyFilter");
  }
}
</script>
