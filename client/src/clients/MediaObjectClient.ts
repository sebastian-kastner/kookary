import { MediaObject } from '../types'
import { MediaObjectApi } from '../../rest/api'
import { clientConfiguration } from './clientConfiguration'
import { ToViewModelConverter } from './ToViewModelConverter'

export class MediaObjectClient {
  client: MediaObjectApi = new MediaObjectApi(clientConfiguration);
  toViewModelConverter = new ToViewModelConverter();

  public async createMediaObject(file: File): Promise<MediaObject> {
    const ret = await this.client.postMediaObjectCollection(file);
    return this.toViewModelConverter.convertMediaObject(ret.data);
  }
}