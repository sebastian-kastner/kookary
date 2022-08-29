<template>
  <div>
    <div class="container">
      <div class="image-preview" v-if="filePreview !== null">
        <img :src="filePreview" alt="Preview Image" />
        <b-icon-x-circle @click="removeImage" />
      </div>
      <div v-else>
        <input
          class="form-control form-control-lg"
          ref="fileInput"
          type="file"
          accept="image/*"
          @input="selectImgFile"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { BIconXCircle } from "bootstrap-vue";
import { MediaObject } from "../types";
import { mediaObjectStore } from "@/stores/rootStore";

@Component({
  components: {
    BIconXCircle,
  },
})
export default class ImageUpload extends Vue {
  filePreview: string | ArrayBuffer | null = null;

  @Prop({ required: false }) inputFile!: MediaObject;

  public mounted(): void {
    this.onInputFileChanged();
  }

  @Watch("inputFile")
  public onInputFileChanged() {
    if (this.inputFile && this.inputFile.mediaObjectId) {
      const resolvedMediaObjectUrl = mediaObjectStore.mediaObjectMap.get(this.inputFile.mediaObjectId);
      if (resolvedMediaObjectUrl) {
        this.filePreview = resolvedMediaObjectUrl;
      }
    }
  }

  public selectImgFile(): void {
    let fileInput = this.$refs.fileInput;
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
    this.filePreview = null;
  }

  private setPreviewFile(file: File): void {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      if (e.target && e.target instanceof FileReader) {
        this.filePreview = e.target.result;
      }
    };
  }
  
}
</script>

<style lang="scss" scoped>

.image-preview svg {
  vertical-align: top;
  font-size: 30pt;
  margin-left: 10px;
}

</style>