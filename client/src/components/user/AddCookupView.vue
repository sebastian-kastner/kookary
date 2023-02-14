<template>
  <div class="container">
    <div>Value: {{ cookupDate }}</div>
    <div>
      <b-form-datepicker v-model="cookupDate" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Cookup, Recipe } from "../../types";
import { BFormDatepicker } from "bootstrap-vue";
import { userStore } from '../../stores/rootStore'
import { CookupClient } from "../../clients/CookupClient";

@Component({
  components: { BFormDatepicker },
})
export default class RecipeView extends Vue {
  @Prop({ required: true }) recipe!: Recipe;

  cookupDate = new Date();

  cookupClient = new CookupClient();

  get loggedInUserId(): number | null {
    const user = userStore.user;
    if (user && user.id) {
      return user.id;
    }
    return null;
  }

  async addCookup(): Promise<Cookup | void> {
    if (!this.loggedInUserId || !this.recipe || !this.recipe.recipeId) {
      return;
    }
    return this.cookupClient.createCookup(this.loggedInUserId, this.recipe.recipeId, new Date());
  }
}

</script>