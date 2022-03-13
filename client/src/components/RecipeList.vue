<template>
  <div class="recipe-list">
    <ul class="list-group">
      <li class="list-group-item" v-for="recipe in recipes" v-bind:key="recipe.recipeId">
        <router-link
          v-bind:key="recipe.recipeId"
          :to="{ path: '/recipe-editor', query: { recipeId: recipe.recipeId } }"
        >
          {{ recipe.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Recipe } from "../types";

@Component({
  components: {},
})
export default class RecipesView extends Vue {
  @Prop({ required: true }) recipes!: Recipe[];
}
</script>
