<template>
  <div class="about">
    <div class="float-right edit-icon">
      <router-link :to="{ path: '/recipe-editor', query: { recipeId: recipe.recipeId } }">
        <b-icon-pencil />
      </router-link>

      <b-icon-bell v-if="!isMarked" v-on:click="setIsMarked(true)" />
      <b-icon-bell-fill v-if="isMarked" v-on:click="setIsMarked(false)" />
    </div>
    <h1>{{ recipe.name }}</h1>
    <div v-if="recipeImgSrc">
      <img :src="recipeImgSrc">
    </div>
    <ul class="list-inline">
      <li class="list-inline-item" 
        v-for="tag in recipe.tags"
        v-bind:key="tag.uuid"
      >
        {{ tag.name }}
      </li>
    </ul>
    <div>
      <h3>Quelle</h3>
      <div>
        <a :href="recipe.source" target="_blank" v-if="sourceIsLink">
          {{ recipe.source }}
        </a>
        <p v-if="!sourceIsLink">
          {{ recipe.source }}
        </p>
      </div>
    </div>
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
import { Recipe, recipeFactory } from "../types";
import { RecipesClient } from "../clients/RecipesClient";
import { BIconPencil, BIconBell, BIconBellFill } from "bootstrap-vue";
import { marked } from "marked"
import { mediaObjectStore } from "../stores/rootStore"

@Component({
  components: { BIconPencil, BIconBell, BIconBellFill },
})
export default class RecipeView extends Vue {
  recipeId?: string;
  recipe: Recipe = recipeFactory();

  recipesClient: RecipesClient = new RecipesClient();

  doValidate = false;

  // poor man's regex for url validation
  urlRegex = new RegExp(/^((http|https):\/\/)?([a-z0-9\-\_]+\.)?([a-z0-9\-\_]+\.)([a-z0-9]){2,5}((\/?)[a-z0-9\-_~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\ \,\;\%\=]*)?$/i);
  
  mounted(): void {
    const routeRecipeId = this.$route.query['recipeId'];
    if (routeRecipeId) {
      this.recipeId = routeRecipeId.toString();
      this.recipesClient.getRecipe(this.recipeId).then((recipe) => {
        this.recipe = recipe;
      });
    } else {
      console.error("No recipe ID given..");
    }
  }

  get recipeImgSrc(): string | null {
    if (this.recipe.image.mediaObjectId) {
      const url = mediaObjectStore.mediaObjectMap.get(this.recipe.image.mediaObjectId);
      if (url) {
        return url;
      }
    }
    return null;
  }

  get sourceIsLink(): boolean {
    if(this.recipe.source) {
      if(this.recipe.source.match(this.urlRegex)) {
        return true;
      }
    }
    return false;
  }

  get description(): string {
    if(this.recipe.description) {
      return marked.parse(this.recipe.description);
    }
    return "";
  }

  get isMarked(): boolean {
    if(this.recipe.marked) {
      return this.recipe.marked;
    }
    return false;
  }

  setIsMarked(isMarked: boolean): void {
    if (!this.recipe?.recipeId) {
      throw new Error("Cannot set marked value, no recipeId set!");
    }
    this.recipe.marked = isMarked;
    this.recipesClient.setMarked(this.recipe.recipeId, isMarked);
  }
}
</script>

<style lang="scss" scoped>

@import "../../main.scss";

.edit-icon {
  text-align: center;
  font-size: 1.5rem;

  svg {
    margin-left: 10px;
  }
}

</style>