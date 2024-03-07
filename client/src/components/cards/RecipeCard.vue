<template>
  <div class="recipe-card col">
    <div v-if="showSeasonality" class="seasonality-score text-end">
      <Icon icon="calendarWeek" />
      <span>
        {{ recipe.currentSeasonalityScore }}
      </span>
    </div>
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
import { Icon } from "@iconify/vue/dist/offline";

@Component({
  components: { Icon },
})
export default class RecipeCard extends Vue {
  @Prop({ required: true }) recipe!: Recipe;
  @Prop({ required: false, default: false }) showSeasonality!: boolean;

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

@mixin recipeCard($width, $height, $margin) {
  width: $width + px;
  max-width: $width + px;
  margin: $margin + px;

  img {
    max-height: $height + px;
  }
}

.recipe-card {
  box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);

  a {
    text-decoration: none !important;
  }

  a:hover {
    text-decoration: underline !important;
    text-decoration-color: black !important;
  }

  .seasonality-score {
    font-size: 0.8em;
    svg {
      margin-bottom: 2px;
      margin-right: 4px;
    }
  }

  .recipe-card-title {
    text-align: center;
    background-color: $background-color-main;
    color: $link-color-main;
    font-weight: bold;
    overflow-x: hidden;
  }

  .recipe-card-image {
    text-align: center;
    padding-top: 2px;

    img {
      max-width: 100%;
    }
  }

  // width on xs
  @include media-breakpoint-down(sm) {
    // width, height, margin
    @include recipeCard(143, 135, 5);

    .recipe-card-title {
      min-height: 55px;
      padding: 5px;
      font-size: smaller;
    }
  }

  // size on small
  @include media-breakpoint-up(sm) {
    // width, height, margin
    @include recipeCard(150, 110, 10);

    .recipe-card-title {
      min-height: 75px;
      padding: 10px;
    }
  }

  // size on medium
  @include media-breakpoint-up(md) {
    // width, height, margin
    @include recipeCard(190, 190, 20);
  }

  // size on large and above
  @include media-breakpoint-up(lg) {
    // width, height, margin
    @include recipeCard(250, 190, 20);
  }
}
</style>
