<template>
  <div id="home" class="main-content">
    <recipe-card-list title="ZUFÄLLIG" :recipeFilter="randRecipeFilter" />

    <recipe-card-list
      title="SAISONAL"
      :recipeFilter="seasonalRecipeFilter"
      :moreLink="{ path: '/recipes', query: { seasonal: null } }"
    />

    <recipe-card-list
      v-if="userLoggedIn"
      title="MERKLISTE"
      :recipeFilter="markedRecipeFilter"
      :moreLink="{ path: '/recipes', query: { marked: null } }"
    />
  </div>
</template>

<script lang="ts">
import { RecipeFilter } from "../clients/RecipesClient";
import { Options, Vue } from "vue-class-component";
import RecipeCardList from "../components/cards/RecipeCardList.vue";
import { userStore } from "../stores/rootStore";
@Options({
  components: {
    RecipeCardList,
  },
})
export default class HomeView extends Vue {
  get userLoggedIn(): boolean {
    return userStore.user !== null;
  }
  seasonalRecipeFilter: RecipeFilter = {
    isSeasonal: true,
    limit: 6,
  };
  markedRecipeFilter: RecipeFilter = {
    marked: true,
    limit: 6,
  };
  randRecipeFilter: RecipeFilter = {
    orderBy: "rand",
    limit: 6,
  };
}
</script>

<style lang="scss">
@import "../../main.scss";
@import "../../node_modules/bootstrap/scss/bootstrap-grid.scss"; // import breakpoint mixin from grid definition
#home {
  @include media-breakpoint-up(sm) {
    padding: $content-padding;
  }
}
</style>
