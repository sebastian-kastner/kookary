<template>
  <div class="ingredients">
    <ul class="list-group">
      <li
        v-for="ingredient in ingredients"
        v-bind:key="ingredient.ingredientId"
      >
        {{ ingredient.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Ingredients, IngredientsApi } from '../api/api'
import { restConfig } from '../constants'

@Options({
  components: {}
})
export default class HomeView extends Vue {
  ingredients: Ingredients[] = [];

  mounted (): void {
    const client = new IngredientsApi(restConfig)
    client.getIngredientsCollection().then((ret) => {
      this.ingredients = ret.data['hydra:member']
      console.log(this.ingredients)
    })
  }
}
</script>
