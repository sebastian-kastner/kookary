import { TagsClient } from "../clients/TagsClient";
import { createModule, mutation, action } from "vuex-class-component";
import { Tag } from "../types";

const VuexModule = createModule({
  namespaced: "tags",
  strict: false,
});

export class TagStore extends VuexModule {
  private tagClient = new TagsClient();

  public isInitialized = false;
  private initPromise: Promise<Tag[]> | null = null;

  public tags: Tag[] = [];
  public tagMap: Map<number, Tag> = new Map<number, Tag>();

  @action
  async init() {
    const initPromise = this.tagClient.getTags();
    this.SET_INIT_PROMISE(initPromise);

    return new Promise<void>((resolve, reject) => {
      initPromise
        .then((tags) => {
          const tagMap = new Map<number, Tag>();
          tags.forEach((tag) => {
            if (tag.tagId && tag.name) {
              tagMap.set(tag.tagId, tag);
            }
          });

          this.SET_TAGS(tags);
          this.SET_TAGS_MAP(tagMap);
          this.SET_IS_INITIALIZED(true);
          resolve();
        })
        .catch((err) => reject(err));
    });
  }

  @action
  async awaitInit(): Promise<void> {
    if (this.isInitialized) {
      return Promise.resolve();
    }
    else if (this.initPromise) {
      await this.initPromise;
      return Promise.resolve();
    }
    return Promise.reject("TagStore is not initialized");
  }

  @action
  async addTag(tagName: string): Promise<Tag> {
    const tag = await this.tagClient.createTag(tagName);
    this.ADD_TAG(tag);
    return tag;
  }

  @mutation
  private SET_INIT_PROMISE(initPromise: Promise<Tag[]>) {
    this.initPromise = initPromise;
  }

  @mutation
  private SET_IS_INITIALIZED(isInitialized: boolean) {
    this.isInitialized = isInitialized;
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
    if (tag.tagId && tag.name) {
      this.tags.push(tag);
      this.tagMap.set(tag.tagId, tag);
    }
  }
}

export default TagStore;
