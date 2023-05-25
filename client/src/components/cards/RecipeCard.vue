<template>
  <div class="recipe-card col">
    <router-link
      :key="recipe.recipeId"
      :to="{ path: '/recipe', query: { recipeId: recipe.recipeId } }"
    >
      <div class="recipe-card-image">
        <img :src="recipeImgSrc" />
      </div>
      <div class="recipe-card-title">
        {{ recipe.name }}
      </div>
    </router-link>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-facing-decorator";
import { Recipe } from "../../types";
import { mediaObjectStore } from "../../stores/rootStore";

@Component({
  components: {},
})
export default class RecipeCard extends Vue {
  @Prop({ required: true }) recipe!: Recipe;

  get recipeImgSrc(): string {
    if (this.recipe.images.length > 0 && this.recipe.images[0].mediaObjectId) {
      const url = mediaObjectStore.mediaObjectMap.get(
        this.recipe.images[0].mediaObjectId
      );
      if (url) {
        return url;
      }
    }
    return "";
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";
@import "../../styles/breakpoints.scss";

.recipe-card {
  box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);

  .recipe-card-title {
    text-align: center;
    background-color: $background-color-main;
    color: $link-color-main;
    font-weight: bold;
    overflow-x: hidden;
  }

  $widthOnXs: 143px;

  // width on xs
  width: $widthOnXs;
  margin: 20px;

  img {
    // max-width: $widthOnXs;
    max-width: 100%;
    max-height: 113px;
  }

  .recipe-card-title {
    min-height: 55px;
    padding: 5px;
  }

  .recipe-card-image {
    text-align: center;
  }

  $widthOnSmall: 180px;
  // size on small
  @include media-breakpoint-up(sm) {
    width: $widthOnSmall;
    margin: 20px;

    img {
      // max-width: $widthOnSmall;
      max-height: 135px;
    }

    .recipe-card-title {
      min-height: 75px;
      padding: 10px;
    }
  }

  // size on medium
  $widthOnMedium: 190px;
  @include media-breakpoint-up(md) {
    width: $widthOnMedium;
    margin: 20px;

    img {
      // max-width: $widthOnMedium;
      max-height: 190px;
    }

    .recipe-card-title {
      min-height: 75px;
      padding: 10px;
    }
  }

  // size on large and above
  $widthOnLg: 250px;
  @include media-breakpoint-up(lg) {
    width: $widthOnLg;
    margin: 20px;

    img {
      // max-width: $widthOnLg;
      max-height: 190px;
    }

    .recipe-card-title {
      min-height: 75px;
      padding: 10px;
    }
  }
}
</style>
