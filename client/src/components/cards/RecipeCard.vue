<template>
  <div class="recipe-card">
    <router-link
      v-bind:key="recipe.recipeId"
      :to="{ path: '/recipe', query: { recipeId: recipe.recipeId } }"
    >
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
export default class RecipeCardList extends Vue {
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

.recipe-card {
  width: 250px;
  margin: 20px;

  img {
    width: 250px;
    height: 190px;
  }

  .recipe-card-title {
    height: 75px;
    text-align: center;
    padding: 10px;
    background-color: $background-color-main;
    box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);
    color: $link-color-main;
    font-weight: bold;
  }
}

</style>
