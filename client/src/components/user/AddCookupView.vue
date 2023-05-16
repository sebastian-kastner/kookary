<template>
  <div>
    <div class="vue-dialog-content">
      <div class="vue-dialog-content-title">
        {{ label }}
      </div>

      <div class="container">
        <vs-datepicker
          id="cookupDate"
          v-model="cookupDate"
          placeholder="DD-MM-YYYY"
          format="DD-MM-YYYY"
        />
        <div
          v-if="error"
          class="alert alert-error"
          warning="alert"
        />
      </div>
    </div>

    <div class="vue-dialog-buttons">
      <button
        type="button"
        tabindex="0"
        class="vue-dialog-button"
        @click="cookupAddedCallback"
      >
        Abbrechen
      </button>
      <button
        type="button"
        tabindex="0"
        class="vue-dialog-button"
        @click="addCookup"
      >
        Hinzufügen
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-facing-decorator";
import { Cookup, Recipe } from "../../types";

import VsDatepicker from "@vuesimple/vs-datepicker";
import { userStore } from "../../stores/rootStore";
import { CookupClient } from "../../clients/CookupClient";

@Component({
  components: { VsDatepicker },
})
export default class RecipeView extends Vue {
  @Prop({ required: true }) recipe!: Recipe;
  @Prop({ required: true }) cookupAddedCallback!: () => void;

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
      this.cookupAddedCallback();
      return;
    }

    return new Promise<Cookup | void>((resolve, reject) => {
      this.cookupClient
        .createCookup(userId, recipeId, this.cookupDate)
        .then((cookup) => {
          this.cookupAddedCallback();
          resolve(cookup);
        })
        .catch((err) => {
          this.error = err.toString();
          reject(err);
        });
    });
  }
}
</script>

<style lang="scss" scoped>
.vue-dialog-button {
  flex: 1 1 50%;
}
</style>
