<template>
  <div class="p-3">
    <div class="d-flex justify-content-center">
      <h2>Saisonalität verwalten</h2>
    </div>
    <div class="d-flex justify-content-center">
      <save-button
        button-text="Saisonalitäts Scores aktualisieren"
        :is-loading="isSaving"
        @click="updateSeasonality"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, mixins } from "vue-facing-decorator";
import { SeasonalityScoreClient } from "../../clients/SeasonalityScoreClient";
import { getErrorMessage } from "../../utils/errors";
import SaveButton from "../../components/SaveButton.vue";
import ToastMixin from "../../mixins/ToastMixin.vue";

@Component({ components: { SaveButton } })
export default class SeasonalityMgmtView extends mixins(ToastMixin) {
  private seasonalityScoreClient = new SeasonalityScoreClient();

  isSaving = false;

  updateSeasonality() {
    this.isSaving = true;
    this.seasonalityScoreClient
      .updateSeasonality()
      .catch((error) => {
        const errorMessage = getErrorMessage(error);
        this.showToast.error(
          `Fehler beim Aktualisieren der Saisonalität: ${errorMessage}`
        );
      })
      .finally(() => {
        this.isSaving = false;
      });
  }
}
</script>
