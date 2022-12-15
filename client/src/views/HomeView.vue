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
  };

  markedRecipeFilter: RecipeFilter = {
    marked: true,
  }
}
</script>

<style lang="scss">
@import "../../main.scss";

#home {
  padding: $content-padding;
}

</style>
