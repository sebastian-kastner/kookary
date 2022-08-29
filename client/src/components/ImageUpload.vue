<template>
  <div>
    <div class="container">
      <div v-if="filePreview !== null">
        <img :src="filePreview" alt="Preview Image" />
      </div>
      <div v-else>
        <input
          class="form-control form-control-lg"
          ref="fileInput"
          type="file"
          @input="selectImgFile"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class ImageUpload extends Vue {
  filePreview: string | null = null;

  @Prop({ required: false, default: true }) autoUpload!: boolean;

  @Prop({ required: false }) file!: File;

  mounted(): void {
    if (this.file) {
      this.setPreviewFile(this.file);
    }
  }

  private selectImgFile(): void {
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

  private setPreviewFile(file: File): void {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      if (e.target && e.target instanceof FileReader) {
        this.filePreview = String(e.target.result);
      }
    };
  }
}
</script>
