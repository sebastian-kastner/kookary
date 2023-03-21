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
    <div v-if="moreLink !== null" class="row d-flex justify-content-center">
      <div class="inline-item-list-element">
        <router-link :to="moreLink">
        Mehr..
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { RecipeFilter, RecipesClient } from "../../clients/RecipesClient";
import { Component, Prop, Vue } from "vue-property-decorator";
import { Recipe } from "../../types";
import RecipeCard from "./RecipeCard.vue";
import { RouterLinkProps } from "vue-router/types/router";

@Component({
  components: { RecipeCard },
})
export default class RecipeCardList extends Vue {
  @Prop({ required: true }) title!: string;
  @Prop({ required: true }) recipeFilter!: RecipeFilter;
  @Prop({ required: false, default: null }) moreLink!: RouterLinkProps;

  recipesClient: RecipesClient = new RecipesClient();
  recipes: Recipe[] = [];

  public mounted() {
    this.recipes = [];
    this.recipesClient.getRecipes(this.recipeFilter).then((recipesList) => {
      const recipes = recipesList.recipes;
      
      let count = 3;
      if (recipes.length < 3) {
        count = recipes.length;
      }
      for (let i = 0; i < count; i++) {
        this.recipes.push(recipes[i]);
      }
    });
  }
}
</script>

<style lang="scss" scoped>
@import "../../../main.scss";

.recipe-card-header {
    font-size: 1.2rem;
    color: $font-color-highlight;
    padding-left: 5px;
}
</style>
