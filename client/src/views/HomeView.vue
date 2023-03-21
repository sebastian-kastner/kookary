<template>
  <div id="home" class="main-content">
    <recipe-card-list
      title="SAISONAL"
      :recipeFilter="seasonalRecipeFilter"
      :moreLink="{ path: '/recipes', query: { seasonal: null } }"
    />

    <recipe-card-list
      title="MERKLISTE"
      :recipeFilter="markedRecipeFilter"
      :moreLink="{ path: '/recipes', query: { marked: null } }"
    />
  </div>
</template>

<script lang="ts">
import { RecipeFilter } from "../clients/RecipesClient";
import { Component, Vue } from "vue-property-decorator";
import RecipeCardList from "../components/cards/RecipeCardList.vue";

@Component({
  components: {
    RecipeCardList,
  },
})
export default class HomeView extends Vue {
  seasonalRecipeFilter: RecipeFilter = {
    isSeasonal: true,
    limit: 3,
  };

  markedRecipeFilter: RecipeFilter = {
    marked: true,
    limit: 3,
  }
}
</script>

<style lang="scss">
@import "../../main.scss";
@import "~bootstrap/scss/bootstrap-grid.scss"; // import breakpoint mixin from grid definition

#home {
  @include media-breakpoint-up(sm) {
    padding: $content-padding;
  }
}

</style>
