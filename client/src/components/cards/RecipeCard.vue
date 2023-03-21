<template>
  <div class="recipe-card">
    <router-link v-bind:key="recipe.recipeId" :to="{ path: '/recipe', query: { recipeId: recipe.recipeId } }">
      <img :src="recipeImgSrc" />
      <div class="recipe-card-title">
        {{ recipe.name }}
      </div>
    </router-link>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Recipe } from "../../types";
import { mediaObjectStore } from "../../stores/rootStore"

@Component({
  components: {},
})
export default class RecipeCard extends Vue {
  @Prop({ required: true }) recipe!: Recipe;

  get recipeImgSrc(): string | null {
    if (this.recipe.images.length > 0 && this.recipe.images[0].mediaObjectId) {
      const url = mediaObjectStore.mediaObjectMap.get(this.recipe.images[0].mediaObjectId);
      if (url) {
        return url;
      }
    }
    return null;
  }
}
</script>

<style lang="scss" scoped>
@import "../../../main.scss";
@import "~bootstrap/scss/bootstrap-grid.scss"; // import breakpoint mixin from grid definition

.recipe-card {

  width: 150px;
  margin: 20px;

  img {
    width: 150px;
    height: 90px;
  }

  .recipe-card-title {
    min-height: 55px;
    padding: 5px;
  }

  // size on small
  @include media-breakpoint-up(sm) {
    width: 180px;
    margin: 20px;

    img {
      width: 180px;
      height: 120px;
    }

    .recipe-card-title {
      min-height: 75px;
      padding: 10px;
    }
  }

  // size on medium
  @include media-breakpoint-up(md) {
    width: 250px;
    margin: 20px;

    img {
      width: 250px;
      min-height: 190px;
    }

    .recipe-card-title {
      height: 75px;
      padding: 10px;
    }
  }


  .recipe-card-title {
    text-align: center;
    background-color: $background-color-main;
    box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);
    color: $link-color-main;
    font-weight: bold;
  }
}
</style>
