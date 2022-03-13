import { Tag } from '../types'
import { TagApi } from '../../rest/api'
import { clientConfiguration } from './clientConfiguration'
import { ToViewModelConverter } from './ToViewModelconverter'
import { ToRestModelConverter } from './ToRestModelConverter'

export class TagsClient {
    client = new TagApi(clientConfiguration);
    toViewModelConverter = new ToViewModelConverter();
    toRestModelConverter = new ToRestModelConverter();

    /**
     * 
     * @returns all tags
     */
    public async getTags(): Promise<Tag[]> {
        const ret = await this.client.getTagCollection()
        const restTags = ret.data['hydra:member']

        const tags: Tag[] = []
        restTags.forEach((restTag) => {
            tags.push(this.toViewModelConverter.convertTag(restTag))
        })

        return tags
    }

    public async getTagNameMap(): Promise<Map<number, string>> {
      const tags = await this.getTags();
      const tagNameMap = new Map<number, string>();
      tags.forEach((tag) => {
        if(tag.tagId && tag.name) {
          tagNameMap.set(tag.tagId, tag.name);
        }
      });
      return tagNameMap;
    }

    /**
     * Creates a new tag
     * @param tagName the name of the tag to create
     * @returns the newly created tag
     */
    public async createTag(tagName: string): Promise<Tag> {
        const ret = await this.client.postTagCollection({
          name: tagName
        });
        return this.toViewModelConverter.convertTag(ret.data);
      }
}