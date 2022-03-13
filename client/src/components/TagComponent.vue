<template>
  <div class="tag-component">
    <div v-if="tagSelected" class="tag">
      {{ tag.name }}
      <p class="tag-delete" v-on:click="deleteTag">x</p>
    </div>
    <typeahead-input
      v-else
      :items="existingTags"
      :value="getTagLabel(tag)"
      :itemProjection="getTagLabel"
      :addNewHandler="addNewTag"
      @selectItem="setTag"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Tag } from "../types";
import { tagStore } from "../stores/rootStore"
import TypeaheadInput from "./TypeaheadInput.vue";

@Component({
  components: { TypeaheadInput },
})
export default class TagComponent extends Vue {
  @Prop({ required: true }) tag!: Tag;
  @Prop({ required: true }) existingTags!: Tag[];

  tagSelected = false;

  mounted(): void {
    if (this.tag.tagId) {
      this.tagSelected = true;
    }
  }

  setTag(tag: Tag): void {
    this.tag.tagId = tag.tagId;
    this.tag.name = tag.name;
    this.tagSelected = true;
    this.$emit("onTagSelected", this.tag);
  }

  deleteTag(): void {
    this.$emit("onDelete", this.tag);
  }

  getTagLabel(tag: Tag): string {
    if (tag.name) {
      return tag.name;
    }
    return "";
  }

  getTagId(tag: Tag): number | null {
    if (tag.tagId) {
      return tag.tagId;
    }
    return null;
  }

  async addNewTag(tagName: string): Promise<void> {
    tagStore.addTag(tagName)
      .then((tag) => {
        this.setTag(tag);
        this.existingTags.push(tag);
      })
      .catch((reason) => {
        console.error("Failed to create tag", tagName, reason);
      });
  }
}
</script>

<style lang="scss">
.tag-component {
  display: inline-block;

  .form-control {
    width: 150px;
  }

  .typeahead-dropdown {
    width: 150px;
  }

  .tag {
    background-color: #17a2b8;
    border-color: #17a2b8;
    line-height: 2.3;
    border-radius: 0.25rem;
    color: white;
    padding-left: 10px;
    padding-right: 10px;
    margin-right: 10px;
    margin-bottom: 5px;
  }

  .tag-delete {
    padding-left: 5px;
    margin-top: 0;
    padding-right: 5px;
    margin-bottom: 0;
    display: inline-block;
  }
  .tag-delete:hover {
    color: gray;
  }
}
</style>
