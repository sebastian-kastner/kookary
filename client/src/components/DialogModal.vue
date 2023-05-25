<template>
  <VueFinalModal
    class="vfm-modal"
    content-class="vfm-modal-content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
  >
    <div class="d-flex justify-content-between">
      <h4>{{ title }}</h4>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        @click="$emit('cancel')"
      ></button>
    </div>

    <div class="pt-3 pb-3">
      {{ text }}
    </div>

    <div class="d-flex justify-content-between">
      <button
        v-if="isSaving === undefined"
        type="button"
        class="btn btn-outline-primary"
        @click="$emit('confirm')"
      >
        {{ confirmText }}
      </button>

      <save-button
        v-else
        :button-text="confirmText"
        :is-loading="isSaving"
        @onSave="$emit('confirm')"
      />

      <button
        type="button"
        class="btn btn-outline-primary"
        @click="$emit('cancel')"
      >
        {{ cancelText }}
      </button>
    </div>
  </VueFinalModal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-facing-decorator";
import { VueFinalModal } from "vue-final-modal";
import SaveButton from "./SaveButton.vue";

@Component({
  components: {
    VueFinalModal,
    SaveButton,
  },
})
export default class DialogModal extends Vue {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  text!: string;

  @Prop({ required: false })
  isSaving!: boolean | undefined;

  @Prop({ required: false, default: "Bestätigen" })
  confirmText = "Bestätigen";

  @Prop({ required: false, default: "Abbrechen" })
  cancelText!: string;
}
</script>
