<template>
  <div class="filter-menu-row-head"><Icon icon="tags" />Tags</div>
  <div class="filter-menu-row-body">
    <inline-item-list
      :suggest-items="existingTags"
      :items="recipeFilter.tags"
      :input-placeholder="inputPlaceholder"
      @itemSelected="filterUpdated"
      @itemDeleted="filterUpdated"
    />
  </div>
</template>

<script lang="ts">
import { RecipeFilter } from "../../clients/RecipesClient";
import { Vue, Component, Prop } from "vue-facing-decorator";
import InlineItemList from "../InlineItemList.vue";
import { tagStore } from "../../stores/rootStore";
import { Tag } from "../../types";
import { Icon } from "@iconify/vue/dist/offline";

@Component({
  components: { InlineItemList, Icon },
  emits: ["filterUpdated"],
})
export default class TagFilterComponent extends Vue {
  @Prop({ required: true }) recipeFilter!: RecipeFilter;

  typeaheadValue = "";
  inputPlaceholder = "Tag...";

  get existingTags(): Tag[] {
    return tagStore.tags;
  }

  filterUpdated(): void {
    this.$emit("filterUpdated");
  }
}
</script>
