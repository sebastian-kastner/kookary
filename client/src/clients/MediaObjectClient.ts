import { MediaObject } from "../types";
import { MediaObjectApi } from "../../rest/api";
import { clientConfiguration } from "./clientConfiguration";
import {
  convertMediaObject,
  convertMediaObjects,
} from "./ToViewModelConverter";
import { userStore } from "../stores/rootStore";

export class MediaObjectClient {
  client: MediaObjectApi = new MediaObjectApi(clientConfiguration);

  public async getMediaObjects(): Promise<MediaObject[]> {
    const ret = await this.client.getMediaObjectCollection();
    const apiMediaObjects = ret.data["hydra:member"];
    return convertMediaObjects(apiMediaObjects);
  }

  public async createMediaObject(
    file: File,
    fileName?: string
  ): Promise<MediaObject> {
    const ret = await this.client.postMediaObjectCollection(
      file,
      fileName,
      userStore.user?.id
    );
    return convertMediaObject(ret.data);
  }

  public async deleteMediaObject(mediaObjectId: number): Promise<void> {
    await this.client.deleteMediaObjectItem(mediaObjectId.toString());
  }
}
