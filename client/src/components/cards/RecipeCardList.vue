<template>
  <div class="recipe-card-list">
    <div class="recipe-card-header">{{ title }}</div>
    <div class="row d-flex justify-content-center">
      <recipe-card
        v-for="recipe in recipes"
        v-bind:key="recipe.recipeId"
        :recipe="recipe"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { RecipeFilter, RecipesClient } from "../../clients/RecipesClient";
import { Component, Prop, Vue } from "vue-property-decorator";
import { Recipe } from "../../types";
import RecipeCard from "./RecipeCard.vue";

@Component({
  components: { RecipeCard },
})
export default class RecipeCardList extends Vue {
  @Prop({ required: true }) title!: string;
  @Prop({ required: true }) recipeFilter!: RecipeFilter;

  recipesClient: RecipesClient = new RecipesClient();
  recipes: Recipe[] = [];

  public mounted() {
    this.recipes = [];
    this.recipesClient.getRecipes(this.recipeFilter).then((recipes) => {
      for (let i = 0; i < 3; i++) {
        this.recipes.push(recipes[i]);
      }
    });
  }
}
</script>

<style lang="scss" scoped>
@import "../../../main.scss";

.recipe-card-header {
  padding-top: 20px;
  color: $font-color-highlight;
}
</style>
