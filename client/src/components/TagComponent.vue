<template>
  <div class="tag-component">
    <div v-if="tagSelected" class="tag">
      {{ internalTagName }}
      <p class="tag-delete" v-on:click="deleteTag">x</p>
    </div>
    <typeahead-input
      v-else
      :data="existingTags"
      :value="getTagLabel(tag)"
      :labelProvider="getTagLabel"
      :idProvider="getTagId"
      :addNewHandler="addNewTag"
      @onSuggestionSelected="setTag"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Tag } from "../types";
import { TagsClient } from "../clients/TagsClient";
import TypeaheadInput from "./TypeaheadInput.vue";

@Component({
  components: { TypeaheadInput },
})
export default class TagComponent extends Vue {
  @Prop({ required: true }) tag!: Tag;
  @Prop({ required: true }) existingTags!: Tag[];

  tagsClient = new TagsClient();
  tagSelected = false;

  internalTagName = "";

  mounted(): void {
    this.internalTagName = this.getInitialTagName();
    if (this.tag.tagId) {
      this.tagSelected = true;
    }
  }

  getInitialTagName(): string {
    if(this.tag.name && this.tag.name !== "") {
      return this.tag.name;
    }
    
    // this is a weird hack because the api does not deliver the tag names with the initial result
    if (!this.tag.name && this.tag.tagId) {
      for (const key in this.existingTags) {
        const tag = this.existingTags[key];
        if (tag.tagId && tag.tagId === this.tag.tagId && tag.name) {
          return tag.name;
        }
      }
    }
    return ""
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
    this.tagsClient
      .createTag(tagName)
      .then((tag) => {
        this.setTag(tag);
        this.existingTags.push(tag);
      })
      .catch((reason) => {
        console.error("Failed to create ingredient", tagName, reason);
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
