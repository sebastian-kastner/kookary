import { Tag } from "../types";
import { TagApi } from "../../rest/api";
import { clientConfiguration } from "./clientConfiguration";
import { convertTag } from "./ToViewModelConverter";
import { toIri } from "./ToRestModelConverter";
import { USER_ENDPOINT } from "./endpoints";
import { userStore } from "../stores/rootStore";

export class TagsClient {
  client = new TagApi(clientConfiguration);

  /**
   *
   * @returns all tags
   */
  public async getTags(): Promise<Tag[]> {
    const ret = await this.client.getTagCollection();
    const restTags = ret.data["hydra:member"];

    const tags: Tag[] = [];
    restTags.forEach((restTag) => {
      tags.push(convertTag(restTag));
    });

    return tags;
  }

  /**
   * Creates a new tag
   * @param tagName the name of the tag to create
   * @returns the newly created tag
   */
  public async createTag(tagName: string): Promise<Tag> {
    const user = userStore.user;
    return new Promise<Tag>((resolve, reject) => {
      if (user && user.id) {
        this.client
          .postTagCollection({
            name: tagName,
            author: toIri(USER_ENDPOINT, user.id),
          })
          .then((response) => {
            resolve(convertTag(response.data));
          })
          .catch((e) => reject(e));
      } else {
        reject("Cannot create tag, no logged in user!");
      }
    });
  }
}
