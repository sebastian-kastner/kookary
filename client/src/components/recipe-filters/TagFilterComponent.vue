<template>
  <div class="row text-center">
    <div class="col-8">
      <inline-item-list
          :suggestItems="existingTags"
          :items="recipeFilter.tags"
          :provideLabel="getTagLabel"
          :provideId="getTagId"
        />
    </div>
    <div class="col">
      <button type="button" class="btn btn-primary" v-on:click="applyFilter">&check;</button>
    </div>
    <div class="col">
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

  getTagLabel(tag: Tag): string {
    if(tag.name) {
      return tag.name;
    }
    return "";
  }

  getTagId(tag: Tag): string {
    return tag.uuid;
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
