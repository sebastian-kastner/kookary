import { MediaObjectClient } from "../clients/MediaObjectClient";
import { createModule, mutation, action } from "vuex-class-component";
import { MediaObject } from "../types";

const VuexModule = createModule({
  namespaced: "mediaObjects",
  strict: false,
})

export class MediaObjectStore extends VuexModule {
  private mediaObjectClient = new MediaObjectClient();

  public mediaObjects: MediaObject[] = [];
  public mediaObjectMap: Map<string, string> = new Map<string, string>();

  @action
  async init() {
    const mediaObjects = await this.mediaObjectClient.getMediaObjects();

    const mediaObjectMap = new Map<string, string>();
    mediaObjects.forEach((mediaObject) => {
      if(mediaObject.mediaObjectId && mediaObject.url) {
        mediaObjectMap.set(mediaObject.mediaObjectId, mediaObject.url);
      }
    });

    this.SET_MEDIA_OBJECTS(mediaObjects);
    this.SET_MEDIA_OBJECTS_MAP(mediaObjectMap);
  }

  @action
  async createMediaObject(file: File): Promise<MediaObject> {
    const mediaObject = await this.mediaObjectClient.createMediaObject(file);
    this.ADD_MEDIA_OBJECT(mediaObject);
    return mediaObject;
  }

  @mutation
  private SET_MEDIA_OBJECTS(mediaObjects: MediaObject[]): void {
    this.mediaObjects = mediaObjects;
  }

  @mutation
  private SET_MEDIA_OBJECTS_MAP(tagsMap: Map<string, string>): void {
    this.mediaObjectMap = tagsMap;
  }

  @mutation
  private ADD_MEDIA_OBJECT(mediaObject: MediaObject): void {
    if(mediaObject.mediaObjectId && mediaObject.url) {
      this.mediaObjects.push(mediaObject);
      this.mediaObjectMap.set(mediaObject.mediaObjectId, mediaObject.url);
    }
  }
}

export default MediaObjectStore;
