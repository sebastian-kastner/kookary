<template>
  <div class="home">
    <div class="container">
      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <input type="file" @change="onFileUpload" />
        </div>
        <div class="form-group">
          <button class="btn btn-primary btn-block btn-lg">Upload File</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { MediaObjectClient } from "@/clients/MediaObjectClient";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {},
})
export default class HomeView extends Vue {

  file?: File;
  client = new MediaObjectClient();

  public onFileUpload(event: Event) {
    /* eslint-disable */
    const target = event.target as any;
    if (target && "files" in target) {
      this.file = target["files"][0];
    }
  }

  public async onSubmit(): Promise<void> {
    if(this.file) {
      const obj = await this.client.createMediaObject(this.file);
      console.log(obj);
    }
  }
}
</script>
