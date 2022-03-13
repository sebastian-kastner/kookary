<template>
  <div>
    <br/>
    <form>
      <div class="form-row">
        <div class="col">
          <input type="text" class="form-control" placeholder="Name">
        </div>
        <div class="col">
          <input type="text" class="form-control" placeholder="Mit Zutat..">
        </div>
        <div class="col">
          <button type="button" class="btn btn-primary">Filter</button>
        </div>
      </div>
    </form>
    <br/>
    <recipe-list :recipes="recipes" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { RecipesClient } from '../clients/RecipesClient'
import { Recipe } from '../types'
import RecipeList from '../components/RecipeList.vue'
import TypeaheadInput from '../components/TypeaheadInput.vue'

@Component({
  components: { RecipeList, TypeaheadInput }
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
