import { TagsClient } from "../clients/TagsClient";
import { createModule, mutation, action } from "vuex-class-component";
import { Tag } from "../types";

const VuexModule = createModule({
  namespaced: "tags",
  strict: false,
})

export class TagStore extends VuexModule {
  private tagClient = new TagsClient();

  public tags: Tag[] = [];
  public tagMap: Map<number, Tag> = new Map<number, Tag>();

  getTags(tagIds: string[]): Tag[] {
    const tags: Tag[] = [];
    tagIds.forEach(stringId => {
      if (stringId && Number.isInteger(stringId)) {
        const id = Number.parseInt(stringId);
        const tag = this.tagMap.get(id);
        if (tag) {
          tags.push(tag);
        }

      }
    });
    return tags;
  }

  @action
  async init() {
    const tags = await this.tagClient.getTags();

    const tagMap = new Map<number, Tag>();
    tags.forEach((tag) => {
      if(tag.tagId && tag.name) {
        tagMap.set(tag.tagId, tag);
      }
    });

    this.SET_TAGS(tags);
    this.SET_TAGS_MAP(tagMap);
  }

  @action
  async addTag(tagName: string): Promise<Tag> {
    const tag = await this.tagClient.createTag(tagName);
    this.ADD_TAG(tag);
    return tag;
  }

  @mutation
  private SET_TAGS(tags: Tag[]): void {
    this.tags = tags;
  }

  @mutation
  private SET_TAGS_MAP(tagsMap: Map<number, Tag>): void {
    this.tagMap = tagsMap;
  }

  @mutation
  private ADD_TAG(tag: Tag): void {
    if(tag.tagId && tag.name) {
      this.tags.push(tag);
      this.tagMap.set(tag.tagId, tag);
    }
  }
}

export default TagStore;
