<template>
  <div class="row d-flex justify-content-center row-cols-3">
    <recipe-card
      v-for="recipe in recipes"
      :key="recipe.recipeId"
      :recipe="recipe"
      :show-seasonality="showSeasonality"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-facing-decorator";
import { Recipe } from "../types";
import RecipeCard from "./cards/RecipeCard.vue";

@Component({
  components: { RecipeCard },
})
export default class RecipesView extends Vue {
  @Prop({ required: true }) recipes!: Recipe[];
  @Prop({ required: false, default: false }) showSeasonality!: boolean;
}
</script>
