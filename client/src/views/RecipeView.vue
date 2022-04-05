<template>
  <div class="about">
    <div class="float-right edit-icon">
      <router-link :to="{ path: '/recipe-editor', query: { recipeId: recipe.recipeId } }">
        <b-icon-pencil />
      </router-link>
    </div>
    <h1>{{ recipe.name }}</h1>
    <ul class="list-inline">
      <li class="list-inline-item" 
        v-for="tag in recipe.tags"
        v-bind:key="tag.uuid"
      >
        {{ tag.name }}
      </li>
    </ul>
    <div>
      <h3>Zutaten</h3>
      <ul>
        <li
          v-for="ingredient in recipe.ingredients"
          v-bind:key="ingredient.uuid"
        >
          {{ ingredient.quantity }} {{ ingredient.unit }} {{ ingredient.ingredient.name }}
        </li>
      </ul>
    </div>
    <h3>Zubereitung</h3>
    <div v-html="description" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Recipe } from "../types";
import { RecipesClient } from "../clients/RecipesClient";
import { BIconPencil } from "bootstrap-vue";
import { marked } from "marked"

@Component({
  components: { BIconPencil },
})
export default class RecipeView extends Vue {
  recipeId?: string;
  recipe: Recipe = {
    ingredients: [],
    tags: [],
    images: [],
  };

  recipesClient: RecipesClient = new RecipesClient();

  doValidate = false;

  mounted(): void {
    const routeRecipeId = this.$route.query['recipeId'];
    if (routeRecipeId) {
      this.recipeId = routeRecipeId.toString();
      this.recipesClient.getRecipe(this.recipeId).then((recipe) => {
        this.recipe = recipe;
        if(this.recipe.tags === undefined) {
          this.recipe.tags = [];
        }
      });
    } else {
      console.log("No recipe ID given..");
    }
  }

  get description(): string {
    if(this.recipe.description) {
      const foo = marked.parse(this.recipe.description);
      return marked.parse(this.recipe.description);
    }
    return "";
  }
}
</script>

<style lang="scss" scoped>

@import "../../main.scss";

.edit-icon {
  text-align: center;
  font-size: 1.5rem;
}

</style>