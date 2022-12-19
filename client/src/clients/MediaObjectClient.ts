import { MediaObject } from '../types'
import { MediaObjectApi } from '../../rest/api'
import { clientConfiguration } from './clientConfiguration'
import { ToViewModelConverter } from './ToViewModelConverter'
import { userStore } from '../stores/rootStore'

export class MediaObjectClient {
  client: MediaObjectApi = new MediaObjectApi(clientConfiguration);
  toViewModelConverter = new ToViewModelConverter();

  public async getMediaObjects(): Promise<MediaObject[]> {
    const ret = await this.client.getMediaObjectCollection();
    const apiMediaObjects = ret.data['hydra:member']
    return this.toViewModelConverter.convertMediaObjects(apiMediaObjects);
  }

  public async createMediaObject(file: File, fileName?: string): Promise<MediaObject> {
    const ret = await this.client.postMediaObjectCollection(file, fileName, userStore.user?.id);
    return this.toViewModelConverter.convertMediaObject(ret.data);
  }

  public async deleteMediaObject(mediaObjectId: number): Promise<void> {
    await this.client.deleteMediaObjectItem(mediaObjectId.toString());
  }
}