<template>
  <div id="recipe-view" class="container main-content">
    <div id="top-icons" class="row justify-content-end">
      <div>
        <router-link
          :to="{
            path: '/recipe-editor',
            query: { recipeId: recipe.recipeId },
          }"
          custom
          v-slot="{ navigate }"
        >
          <button @click="navigate" role="link" class="rounded-button">
            <b-icon-pencil />
          </button>
        </router-link>
      </div>

      <button
        v-if="!isMarked"
        v-on:click="setIsMarked(true)"
        class="rounded-button"
      >
        <b-icon-bell />
      </button>
      <button
        v-if="isMarked"
        v-on:click="setIsMarked(false)"
        class="rounded-button active"
      >
        <b-icon-bell-fill />
      </button>
    </div>

    <div class="recipe-image row" v-if="recipeImgSrc">
      <img :src="recipeImgSrc" />
    </div>

    <div id="recipe-description">
      <div class="tags row">
        <div
          v-for="item in recipe.tags"
          class="inline-item-list-element"
          v-bind:key="item.uuid"
        >
          <router-link :to="{ path: '/recipes', query: { tags: item.tagId } }" >
            {{ item.name }}
          </router-link>
        </div>
      </div>

      <div class="row">
        <h1>{{ recipe.name }}</h1>
      </div>

      <div class="row">
        <h2>ZUTATEN</h2>
      </div>

      <div class="row">
        <ul>
          <li
            v-for="ingredient in recipe.ingredients"
            v-bind:key="ingredient.uuid"
          >
            {{ ingredient.quantity }} {{ ingredient.unit }}
            <router-link :to="{ path: '/recipes', query: { ingredients: ingredient.ingredient.ingredientId } }"
            >
              {{ ingredient.ingredient.name }}
            </router-link>
          </li>
        </ul>
      </div>

      <div class="row">
        <h2>ZUBEREITUNG</h2>
      </div>

      <div class="row" v-html="description" />

      <div class="row">
        <h2>QUELLE</h2>
      </div>
      <div class="row">
        <a v-if="sourceLink !== null" :href="sourceLink" target="_blank">
          {{ recipe.source }}
        </a>
        <p v-else>
          {{ recipe.source }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Recipe, recipeFactory } from "../types";
import { RecipesClient } from "../clients/RecipesClient";
import { BIconPencil, BIconBell, BIconBellFill } from "bootstrap-vue";
import { marked } from "marked";
import { mediaObjectStore } from "../stores/rootStore";

@Component({
  components: { BIconPencil, BIconBell, BIconBellFill },
})
export default class RecipeView extends Vue {
  recipeId?: string;
  recipe: Recipe = recipeFactory();

  recipesClient: RecipesClient = new RecipesClient();

  doValidate = false;

  // poor man's regex for url validation
  urlRegex = new RegExp(
    /^((http|https):\/\/)?([a-z0-9\-\_]+\.)?([a-z0-9\-\_]+\.)([a-z0-9]){2,5}((\/?)[a-z0-9\-_~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\ \,\;\%\=]*)?$/i
  );

  mounted(): void {
    const routeRecipeId = this.$route.query["recipeId"];
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
    if (this.recipe.images.length > 0 && this.recipe.images[0].mediaObjectId) {
      const url = mediaObjectStore.mediaObjectMap.get(
        this.recipe.images[0].mediaObjectId
      );
      if (url) {
        return url;
      }
    }
    return null;
  }

  get sourceLink(): string | null {
    if (this.recipe.source) {
      if (this.recipe.source.match(this.urlRegex)) {
        if (
          !this.recipe.source.startsWith("http") &&
          !this.recipe.source.startsWith("https")
        ) {
          return "http://" + this.recipe.source;
        }
        return this.recipe.source;
      }
    }
    return null;
  }

  get description(): string {
    if (this.recipe.description) {
      return marked.parse(this.recipe.description);
    }
    return "";
  }

  get isMarked(): boolean {
    if (this.recipe.marked) {
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

#recipe-view {
  width: 80%;

  .row {
    padding-top: 15px;
  }

  h2 {
    font-size: 1.5rem;
    color: $font-color-highlight;
  }

  #top-icons {
    padding-left: $content-padding;
    padding-right: $content-padding;
    font-size: 1.5rem;

    button {
      border-radius: 30px; // this overwrites the border-radius in round-button
      margin-left: 10px;
      padding-left: 10px;
      padding-right: 10px;
      padding-bottom: 5px;
    }
  }

  #recipe-description {
    padding: 0 $content-padding $content-padding $content-padding;
  }

  .recipe-image {
    text-align: center;

    img {
      width: 100%;
      max-height: 600px;
    }
  }

  .tags {
    margin-top: 20px;
    margin-bottom: 10px;
  }
}
</style>