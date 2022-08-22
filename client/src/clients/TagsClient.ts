import { Tag } from '../types'
import { TagApi } from '../../rest/api'
import { clientConfiguration } from './clientConfiguration'
import { ToViewModelConverter } from './ToViewModelConverter'
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