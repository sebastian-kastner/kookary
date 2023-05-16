<template>
  <button
    class="btn rounded-button"
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
@import "../../main.scss";

.btn {
  padding-left: 35px;
}
</style>
