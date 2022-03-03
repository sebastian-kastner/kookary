<template>
  <recipe-list :recipes="recipes" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { RecipesClient } from '../clients/RecipesClient'
import { Recipe } from '../types'
import RecipeList from '../components/RecipeList.vue'

@Component({
  components: { RecipeList }
})
export default class RecipesView extends Vue {
  recipes: Recipe[] = [];

  mounted (): void {
    const client = new RecipesClient()
    client.getRecipes().then((ret) => {
      this.recipes = ret
    })
  }
}
</script>
