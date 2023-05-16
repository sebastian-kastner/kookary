<template>
  <div>
    <div
      v-if="filePreview !== null"
      class="image-preview"
    >
      <img
        ref="filePreview"
        :src="filePreview"
        alt="Preview Image"
      >
      <Icon
        icon="xCircle"
        @click="removeImage"
      />
      <div
        v-if="badDimensions"
        class="bad-dimension-hint"
      >
        Bilder im Querformat sind empfohlen!
      </div>
    </div>
    <div
      v-else
      class="custom-file"
      style="padding: 0; margin: 0"
    >
      <input
        id="inputGroupFile"
        ref="fileInput"
        type="file"
        accept="image/*"
        @input="selectImgFile"
      >
      <label
        class="custom-file-label"
        for="inputGroupFile"
      >Bild wählen</label>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-facing-decorator";
import { Icon } from '@iconify/vue/dist/offline';

import { MediaObject } from "../types";
import { mediaObjectStore } from "../stores/rootStore";

@Component({ components: { Icon }})
export default class ImageUpload extends Vue {
  filePreview: string | ArrayBuffer | null = null;
  badDimensions = false;

  @Prop({ required: false }) inputFile!: MediaObject;

  public mounted(): void {
    this.onInputFileChanged();
  }

  @Watch("inputFile")
  public onInputFileChanged() {
    if (this.inputFile && this.inputFile.mediaObjectId) {
      const resolvedMediaObjectUrl = mediaObjectStore.mediaObjectMap.get(
        this.inputFile.mediaObjectId
      );
      if (resolvedMediaObjectUrl) {
        this.setPreviewFileUrl(resolvedMediaObjectUrl);
      }
    }
  }

  public selectImgFile(): void {
    const fileInput = this.$refs.fileInput;
    if (fileInput) {
      /* eslint-disable */
      const inputAsAny = fileInput as any;
      const files = inputAsAny.files;
      const selectedFile = files[0];

      if (selectedFile && selectedFile instanceof File) {
        this.setPreviewFile(selectedFile);
        this.$emit("imageSelected", selectedFile);
      }
    }
  }

  public removeImage(): void {
    this.$emit("imageRemoved");
    this.setPreviewFileUrl(null);
  }

  private setPreviewFile(file: File): void {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      if (e.target && e.target instanceof FileReader) {
        this.setPreviewFileUrl(e.target.result);
      }
    };
  }

  private setPreviewFileUrl(url: string | ArrayBuffer | null = null): void {
    this.filePreview = url;
    // FIXME: hackish way of checking image dimensions
    setTimeout(() => {
      if (this.$refs.filePreview) {
        const img = this.$refs.filePreview;
        if (img instanceof Image) {
          if (img.width / img.height < 1.3) {
            this.badDimensions = true;
          } else {
            this.badDimensions = false;
          }
        }
      }
    }, 50);
  }
}
</script>

<style lang="scss" scoped>
@import "../../main.scss";

.image-preview svg {
  vertical-align: top;
  font-size: 30pt;
  margin-left: 10px;
}

.image-preview img {
  max-height: 300px;
  max-height: 200px;
}

.bad-dimension-hint {
  border: 1px solid $button-color-main;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 10px;
  width: 300px;
}
</style>