<template>
  <div class="row d-flex justify-content-center">
      <recipe-card
        v-for="recipe in recipes"
        v-bind:key="recipe.recipeId"
        :recipe="recipe"
      />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-facing-decorator";
import { Recipe } from "../types";
import RecipeCard from "./cards/RecipeCard.vue";

@Component({
  components: { RecipeCard },
})
export default class RecipesView extends Vue {
  @Prop({ required: true }) recipes!: Recipe[];
}
</script>
