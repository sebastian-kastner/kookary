<template>
  <VueFinalModal
    class="vfm-modal"
    content-class="vfm-modal-content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
  >
    <div class="d-flex justify-content-between">
      <h4>{{ label }}</h4>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        @click="$emit('cancel')"
      ></button>
    </div>

    <div class="container">
      <vs-datepicker
        id="cookupDate"
        v-model="cookupDate"
        placeholder="DD-MM-YYYY"
        format="DD-MM-YYYY"
      />
      <div v-if="error" class="alert alert-error" warning="alert" />
    </div>

    <div class="d-flex justify-content-between">
      <button
        type="button"
        tabindex="0"
        class="btn btn-outline-primary"
        @click="$emit('cancel')"
      >
        Abbrechen
      </button>
      <button
        type="button"
        tabindex="0"
        class="btn btn-outline-primary"
        @click="addCookup"
      >
        Hinzufügen
      </button>
    </div>
  </VueFinalModal>
</template>

<script lang="ts">
import { Component, Prop, mixins } from "vue-facing-decorator";
import { Cookup, Recipe } from "../../types";

import VsDatepicker from "@vuesimple/vs-datepicker";
import ToastMixin from "../../mixins/ToastMixin.vue";
import { userStore } from "../../stores/rootStore";
import { CookupClient } from "../../clients/CookupClient";
import { VueFinalModal } from "vue-final-modal";
import { getErrorMessage } from "../../utils/errors";

@Component({
  components: { VsDatepicker, VueFinalModal },
})
export default class RecipeView extends mixins(ToastMixin) {
  @Prop({ required: true }) recipe!: Recipe;

  cookupDate = new Date();

  cookupClient = new CookupClient();

  error: null | string = null;

  get label(): string {
    return this.recipe.name + " gekocht am";
  }

  get loggedInUserId(): number | null {
    const user = userStore.user;
    if (user && user.id) {
      return user.id;
    }
    return null;
  }

  async addCookup(): Promise<Cookup | void> {
    const userId = this.loggedInUserId;
    const recipeId = this.recipe.recipeId;
    this.error = null;

    if (!userId || !this.recipe || !recipeId) {
      // FIXME: this is weird error handling..
      this.$emit("cookupAdded");
      return;
    }

    return new Promise<Cookup | void>((resolve, reject) => {
      this.cookupClient
        .createCookup(userId, recipeId, this.cookupDate)
        .then((cookup) => {
          this.$emit("cookupAdded");
          resolve(cookup);
        })
        .catch((err) => {
          this.error = err.toString();
          reject(err);
          const msg = getErrorMessage(err);
          this.showToast.error("Fehler Hinzufügen des Cookups: " + msg);
        });
    });
  }
}
</script>
