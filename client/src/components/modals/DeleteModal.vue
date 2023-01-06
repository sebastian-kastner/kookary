<template>
  <div role="document">
    <div>
      <div class="modal-header">
        <h5 class="modal-title">{{ title }}</h5>
      </div>
      <div class="modal-body">
        <p>{{ description }}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" @click="confirm">Löschen</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="dismiss">Abbrechen</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class UserEditor extends Vue {
  @Prop({required: true })
  title!: string;

  @Prop({required: true })
  description!: string;

  @Prop({required: true })
  private confirmHandler!: () => void

  confirm(): void {
    this.confirmHandler();
    this.$modal.hideAll();
  }

  dismiss(): void {
    this.$modal.hideAll();
  }
}
</script>