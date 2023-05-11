<template>
  <button
    class="btn rounded-button"
    v-on:click="emitSave"
    :disabled="isLoading"
  >
    {{ buttonText }}
    <b-spinner
      small
      label="Speichern"
      v-bind:style="isLoading ? 'visibility: visible' : 'visibility: hidden'"
    />
  </button>
</template>

<script lang="ts">
import { Prop } from "vue-facing-decorator";
import { Options, Vue } from "vue-class-component";

@Options({})
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
  padding-left: 37px;
}
</style>
