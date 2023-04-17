<template>
  <div>
    <div class="vue-dialog-content">
      <div class="vue-dialog-content-title">Ungespeicherte Änderungen</div>

      <div class="container">
        Es gibt ungespeicherte Änderungen.
      </div>
    </div>

    <div class="vue-dialog-buttons d-flex justify-content-around">
      <button class="btn rounded-button" @click="discardHandler">Verwerfen</button>
      <save-button buttonText="Speichern" :isLoading="isSaving" @onSave="saveHandler" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import SaveButton from "../SaveButton.vue";

@Component({
  components: {
    SaveButton
  },
})
export default class ConfirmLeaveModal extends Vue {
  @Prop({ required: true }) saveHandler!: () => void;
  @Prop({ required: true }) discardHandler!: () => void;
  @Prop({ required: true }) isSaving!: boolean;
}
</script>

<style lang="scss" scoped>
.vue-dialog-buttons {
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>