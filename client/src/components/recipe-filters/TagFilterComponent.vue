<template>
  <div class="row">
    <div class="col-12">
      <inline-item-list
        :suggestItems="existingTags"
        :items="recipeFilter.tags"
        :inputPlaceholder="inputPlaceholder"
        @itemSelected="applyFilter"
        @itemDeleted="applyFilter"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { RecipeFilter } from "../../clients/RecipesClient";
import { Prop } from "vue-facing-decorator";
import { Options, Vue } from "vue-class-component";
import InlineItemList from "../InlineItemList.vue";
import { tagStore } from "../../stores/rootStore";
import { Tag } from "../../types";

@Options({
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
