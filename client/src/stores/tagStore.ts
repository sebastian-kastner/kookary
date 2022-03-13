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
  public tagMap: Map<number, string> = new Map<number, string>();

  @action
  async init() {
    const tags = await this.tagClient.getTags();

    const tagMap = new Map<number, string>();
    tags.forEach((tag) => {
      if(tag.tagId && tag.name) {
        tagMap.set(tag.tagId, tag.name);
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
  private SET_TAGS_MAP(tagsMap: Map<number, string>): void {
    this.tagMap = tagsMap;
  }

  @mutation
  private ADD_TAG(tag: Tag): void {
    if(tag.tagId && tag.name) {
      this.tags.push(tag);
      this.tagMap.set(tag.tagId, tag.name);
    }
  }
}

export default TagStore;
