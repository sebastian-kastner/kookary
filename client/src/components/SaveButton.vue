<template>
  <button
    class="btn btn-outline-primary save-button"
    :disabled="isLoading"
    @click="emitSave"
  >
    {{ buttonText }}
    <span
      class="spinner-border spinner-border-sm"
      role="status"
      :style="isLoading ? 'visibility: visible' : 'visibility: hidden'"
    />
  </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-facing-decorator";

@Component({})
export default class SaveButton extends Vue {
  @Prop({ required: true })
  isLoading!: boolean;

  @Prop({ required: true })
  buttonText!: string;

  emitSave(): void {
    this.$emit("onSave");
  }
}
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";

.save-button {
  padding-left: 33px !important;
}

.save-button:disabled {
  color: white;
  background-color: $button-color-secondary;
  border: black;
}
</style>
