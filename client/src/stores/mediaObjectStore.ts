import { MediaObjectClient } from "../clients/MediaObjectClient";
import { createModule, mutation, action } from "vuex-class-component";
import { MediaObject } from "../types";

const VuexModule = createModule({
  namespaced: "mediaObjects",
  strict: false,
})

export type CreateMediaObjectRequest = {
  file: File,
  fileName?: string,
}

export class MediaObjectStore extends VuexModule {
  private mediaObjectClient = new MediaObjectClient();

  public mediaObjects: MediaObject[] = [];
  public mediaObjectMap: Map<number, string> = new Map<number, string>();

  @action
  async init() {
    const mediaObjects = await this.mediaObjectClient.getMediaObjects();

    const mediaObjectMap = new Map<number, string>();
    mediaObjects.forEach((mediaObject) => {
      if(mediaObject.mediaObjectId && mediaObject.url) {
        mediaObjectMap.set(mediaObject.mediaObjectId, mediaObject.url);
      }
    });

    this.SET_MEDIA_OBJECTS(mediaObjects);
    this.SET_MEDIA_OBJECTS_MAP(mediaObjectMap);
  }

  @action
  async createMediaObject(request: CreateMediaObjectRequest): Promise<MediaObject> {
    const mediaObject = await this.mediaObjectClient.createMediaObject(request.file, request.fileName);
    this.ADD_MEDIA_OBJECT(mediaObject);
    return mediaObject;
  }

  @action
  async deleteMediaObject(mediaObjectId: number): Promise<void> {
    await this.mediaObjectClient.deleteMediaObject(mediaObjectId);
    this.REMOVE_MEDIA_OBJECT(mediaObjectId);
  }

  @mutation
  private SET_MEDIA_OBJECTS(mediaObjects: MediaObject[]): void {
    this.mediaObjects = mediaObjects;
  }

  @mutation
  private SET_MEDIA_OBJECTS_MAP(tagsMap: Map<number, string>): void {
    this.mediaObjectMap = tagsMap;
  }

  @mutation
  private ADD_MEDIA_OBJECT(mediaObject: MediaObject): void {
    if(mediaObject.mediaObjectId && mediaObject.url) {
      this.mediaObjects.push(mediaObject);
      this.mediaObjectMap.set(mediaObject.mediaObjectId, mediaObject.url);
    }
  }

  @mutation
  private REMOVE_MEDIA_OBJECT(mediaObjectId: number): void {
    if(this.mediaObjectMap.has(mediaObjectId)) {
      this.mediaObjectMap.delete(mediaObjectId);
    }
  }
}

export default MediaObjectStore;
