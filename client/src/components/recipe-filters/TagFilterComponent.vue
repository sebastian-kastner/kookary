<template>
  <div class="row">
    <div class="col-12">
      <inline-item-list
        :suggest-items="existingTags"
        :items="recipeFilter.tags"
        :input-placeholder="inputPlaceholder"
        @itemSelected="applyFilter"
        @itemDeleted="applyFilter"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { RecipeFilter } from "../../clients/RecipesClient";
import { Vue, Component, Prop } from "vue-facing-decorator";
import InlineItemList from "../InlineItemList.vue";
import { tagStore } from "../../stores/rootStore";
import { Tag } from "../../types";

@Component({
  components: { InlineItemList },
})
export default class NameFilterComponent extends Vue {
  @Prop({ required: true }) recipeFilter!: RecipeFilter;

  inputPlaceholder = "Tag Name...";

  get existingTags(): Tag[] {
    return tagStore.tags;
  }

  applyFilter(): void {
    this.$emit("applyFilter");
  }
}
</script>
